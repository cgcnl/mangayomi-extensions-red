const mangayomiSources = [{
    "name": "Njav",
    "lang": "all",
    "baseUrl": "https://123av.com/en",
    "apiUrl": "",
    "iconUrl": "https://123av.com/assets/njav/images/favicon.png",
    "typeSource": "single",
    "isManga": false,
    "itemType": 1,
    "isNsfw": true,
    "version": "0.1.1",
    "apiUrl": "",
    "dateFormat": "",
    "dateFormatLocale": "",
    "pkgName": "anime/src/all/njav.js"
  }];
  
  class DefaultExtension extends MProvider {
    dateStringToTimestamp(dateString) {
      var parts = dateString.split('-');
      var year = parseInt(parts[0]);
      var month = parseInt(parts[1]) - 1;
      var day = parseInt(parts[2]);
      var date = new Date(year, month, day);
      var timestamp = date.getTime();
      return timestamp;
    }
  
    async request(url) {
      const preference = new SharedPreferences();
      const res = await new Client().get(preference.get("url") + "/" + preference.get("lang") + url);
      return res.body;
    }

    async getCategoryUrls() {
        const res = await this.request("/today-hot");
        // const res = await this.request("/dm1/today-hot");
        const doc = new Document(res);
        const pre_categories = [
            'recommended',
            'censored',
            'uncensored',
            'uncensored-leaked',
            'vr',
            'tags/fc2',
            'tags/heyzo',
            'tags/tokyo-hot',
            'tags/1pondo',
            'tags/caribbeancom',
            'tags/caribbeancompr',
            'tags/10musume',
            'tags/pacopacomama',
            'tags/gachig',
            'tags/xxx-av',
            'tags/c0930',
            'tags/h4610',
            'tags/h0930',
            'tags/siro',
            'tags/259luxu',
            'tags/200gana',
            'tags/prestige-premium',
            'tags/s-cute',
            'tags/261ara',
            'trending',
            'new-release'
        ];
        const elements = doc.select("ul li a");
        const categories = {};
        for (const element of elements) {
            const url = element.attr("href");
            for (const cat of pre_categories) {
              if (url === cat  || url.endsWith("/" + cat)) {
                categories[cat] = url;
                break;
              }
            }
        }
        return categories;
    }

    async getItems(category, url) {
      const category_urls = await this.getCategoryUrls();
      if (category in category_urls) {
      	category = category_urls[category];
      }
      const url1 = "/" + category + url;
      const res = await this.request(url1);
      const doc = new Document(res);
      const elements = doc.select(".box-item-list .box-item");
      const items = [];
      for (const element of elements) {
        const cover = element.selectFirst("img").attr("data-src");
        const info = element.selectFirst("div.detail a");
        const url = info.attr("href");
        const title = info.text;
        items.push({
          link: "/" + url,
          imageUrl: cover,
          name: title
        });
      }
      return {
        list: items,
        hasNextPage: true
      }
    }

    async getPopular(page) {
      await this.getCategoryUrls();
      return await this.getItems(`trending`, `?page=${page}`);
    }

    async getLatestUpdates(page) {
      return await this.getItems(`new-release`, `?page=${page}`);
    }

    async search(query, page, filters) {
      if (query == "") {
        var category, sort;
        for (const filter of filters) {
          if (filter["type"] == "CateFilter") {
            category = filter["values"][filter["state"]]["value"];
          } else if (filter["type"] == "SortFilter") {
            sort = filter["values"][filter["state"]]["value"];
          }
        }
        return await this.getItems(category, `?sort=${sort}&page=${page}`);
      } else {
        return await this.getItems(``, `search?keyword=${query}&page=${page}`);
      }
    }
  
    async getEpisodes(id, time) {
      const res = await this.request(`/ajax/v/${id}/videos`);
      const datas = JSON.parse(res);
      const ep = [];
      for (const data of datas["result"]["watch"]) {
        ep.push({
          name: data["name"],
          url: data["url"],
          dateUpload: time.toString()
        });
      }
      return ep;
    }
  
    async getDetail(url) {
      const res = await this.request(url);
      const doc = new Document(res);
      const body = doc.selectFirst("div#body");
      const title = body.selectFirst("h1").text;
      const cover = body.selectFirst("div#player").attr("data-poster");
      const info = body.selectFirst("div.detail-item").select("div");
      var desc;
      try {
        desc = body.selectFirst("div.description p").text;
      } catch {
        desc = "";
      }
      const updateTime = this.dateStringToTimestamp(info[1].select("span")[1].text);
      var author;
      try {
        author = info[3].select("span")[1].text.replaceAll("\n", "");
      } catch {
        author = "Unknown";
      }
      var genres
      try {
        genres = info[4].selectFirst("span.genre").select("a").map(e => e.text);
      } catch {
        genres = [];
      }
      const v_scope = body.selectFirst("div.container").attr("v-scope");
      const comma_idx = v_scope.indexOf(",");
      const start_idx = v_scope.indexOf("id: ") + 4;
      const id = v_scope.slice(start_idx, comma_idx);
      const eps = await this.getEpisodes(id, updateTime);
      return {
        name: title,
        imageUrl: cover,
        author: author,
        genre: genres,
        description: desc,
        episodes: eps
      };
    }
  
    async getVideoList(url) {
      const real_url = this.decode_video_url(url);
      const res = await new Client().get(real_url);
      const doc = new Document(res.body);
      let packed_js = "";
      for (const script of doc.select("script")) {
        if (script.text && script.text.includes("eval(function(p,a,c,k,e,d)")) {
          packed_js = script.text;
            break;
        }
      }
      const regex = /return p}\('(.+?)',(\d+),(\d+),'(.+?)'\.split\('\|'\)/;
      const match = packed_js.match(regex);
      if (match) {
        const p = match[1];
        const a = parseInt(match[2], 10);
        const c = parseInt(match[3], 10);
        const k = match[4].split('|');
        return await this.unpackAndGetStream(p, a, c, k);
      } else {
        console.error("Không tìm thấy pattern trong packed_js");
        return [];
      }
    }

    async unpackAndGetStream(p, a, c, k) {
      const preference = new SharedPreferences();

      const unpacked_js = this.decrypt_js_content(p, a, c, k);

      function extractXParams(codeString) {
        const paramsList = [];
        const regex = /x\(([^,]+),([^)]+)\)/g;
        let match;

        while ((match = regex.exec(codeString)) !== null) {
          const arg1 = parseInt(match[1].trim(), 10);  // Arg1 (group 1)
          const arg2 = parseInt(match[2].trim(), 10);  // Arg2 (group 2)
          paramsList[arg1] = arg2;
        }

        return paramsList;
      }

      const arr = extractXParams(unpacked_js);
      const media = JSON.parse(String.fromCharCode.apply(null,arr.map((v,i)=>v^i)));

      const final_url = media.stream;

      const headers = {
        'Origin': preference.get("url"),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
      const response = await new Client().get(final_url, headers);
      const codigo = response.body;

      const streams = [];
      const lines = codigo.split('\n');
      const prefix = final_url.replace('playlist.m3u8', '').replace('video.m3u8', '');
      const stream_headers =  {
          Referer: "https://surrit.store/",
          Origin: "https://surrit.store"
        }
      for (const line of lines) {
        if (line.startsWith('#EXT-X-STREAM-INF')) {
          const res_part_match = line.match(/RESOLUTION=\d+x(\d+)/);
          if (res_part_match) {
            streams.push({ quality: res_part_match[1], url: '', originalUrl: '', headers: stream_headers });
          }
        } else if (streams.length > 0 && !line.startsWith('#') && streams[streams.length - 1].url === '') {
          let url = line.startsWith('http') ? line : prefix + line;
          streams[streams.length - 1].url = url;
          streams[streams.length - 1].originalUrl = url;
        }
      }

      return streams;
    }


    decode_video_url(decoded_url) {
      const c = "MW4RNiPvelzziJcx".split("").map(char => char.charCodeAt(0));

      function base64Decode(str) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const output = [];
        let i = 0;
        while (i < str.length) {
          const enc1 = chars.indexOf(str[i++]);
          const enc2 = chars.indexOf(str[i++]);
          const enc3 = chars.indexOf(str[i++]);
          const enc4 = chars.indexOf(str[i++]);

          const chr1 = (enc1 << 2) | (enc2 >> 4);
          const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          const chr3 = ((enc3 & 3) << 6) | enc4;

          output.push(chr1);
          if (enc3 !== 64) output.push(chr2);
          if (enc4 !== 64) output.push(chr3);
        }
        return new Uint8Array(output);
      }

      const decodedArray = base64Decode(decoded_url);

      const result = new Uint8Array(decodedArray.length);
      for (let t = 0; t < decodedArray.length; t++) {
        result[t] = decodedArray[t] ^ c[t % c.length];
      }

      return String.fromCharCode.apply(null, result);
    }

    decrypt_js_content(p, a, c, k) {
      let d = {};
      function e(c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
      };
      if (!"".replace(/^/, String)) {
        while (c--) {
          d[e(c)] = k[c] || e(c);
        }
        k = [function (e) {
          return d[e];
        }];
        e = function () {
          return "\\w+";
        };
        c = 1;
      }

      while (c--) {
        if (k[c]) {
          p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
        }
      }
      return p;
    }
  
    getFilterList() {
      return [{
          "type": "CateFilter",
          "type_name": "SelectFilter",
          "name": "Category",
          "values": [{
              "value": "recommended",
              "name": "Recommended",
              "type_name": "SelectOption"
            },
            {
              "value": "censored",
              "name": "Censored",
              "type_name": "SelectOption"
            },
            {
              "value": "uncensored",
              "name": "Uncensored",
              "type_name": "SelectOption"
            },
            {
              "value": "uncensored-leaked",
              "name": "Uncensored Leaked",
              "type_name": "SelectOption"
            },
            {
              "value": "vr",
              "name": "VR",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/fc2",
              "name": "FC2",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/heyzo",
              "name": "HEYZO",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/tokyo-hot",
              "name": "Tokyo-Hot",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/1pondo",
              "name": "1pondo",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/caribbeancom",
              "name": "Caribbeancom",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/caribbeancompr",
              "name": "Caribbeancompr",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/10musume",
              "name": "10musume",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/pacopacomama",
              "name": "pacopacomama",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/gachig",
              "name": "Gachinco",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/xxx-av",
              "name": "XXX-AV",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/c0930",
              "name": "C0930",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/h4610",
              "name": "H4610",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/h0930",
              "name": "H0930",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/siro",
              "name": "SIRO",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/259luxu",
              "name": "LUXU",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/200gana",
              "name": "200GANA",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/prestige-premium",
              "name": "PRESTIGE PREMIUM",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/s-cute",
              "name": "S-CUTE",
              "type_name": "SelectOption"
            },
            {
              "value": "tags/261ara",
              "name": "ARA",
              "type_name": "SelectOption"
            }
          ]
        },
        {
          "type": "SortFilter",
          "type_name": "SelectFilter",
          "name": "Sort",
          "values": [{
              "value": "recent_update",
              "name": "Recent Update",
              "type_name": "SelectOption"
            },
            {
              "value": "release_date",
              "name": "Release date",
              "type_name": "SelectOption"
            },
            {
              "value": "trending",
              "name": "Trending",
              "type_name": "SelectOption"
            },
            {
              "value": "most_viewed_today",
              "name": "Most viewed today",
              "type_name": "SelectOption"
            },
            {
              "value": "most_viewed_week",
              "name": "Most viewed by week",
              "type_name": "SelectOption"
            },
            {
              "value": "most_viewed_month",
              "name": "Most viewed by month",
              "type_name": "SelectOption"
            },
            {
              "value": "most_viewed",
              "name": "Most viewed",
              "type_name": "SelectOption"
            }, {
              "value": "most_favourited",
              "name": "Most favourited",
              "type_name": "SelectOption"
            }
          ]
        }
      ];
  
    }
  
    getSourcePreferences() {
      return [{
          "key": "lang",
          "listPreference": {
            "title": "Language",
            "summary": "",
            "valueIndex": 0,
            "entries": ["English", "繁體中文", "日本語", "한국의", "Melayu", "ไทย", "Deutsch", "Français", "Tiếng Việt"],
            "entryValues": ["en", "zh", "ja", "ko", "ms", "th", "de", "fr", "vi"],
          }
        },
        {
          "key": "url",
          "listPreference": {
            "title": "Website Url",
            "summary": "",
            "valueIndex": 0,
            "entries": ["123av", "missav", "javgo"],
            "entryValues": ["https://123av.com", "https://missav.sh", "https://www.javgo.to"],
          }
        }
      ];
    }
  }
