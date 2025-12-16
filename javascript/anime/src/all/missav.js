const mangayomiSources = [{
    "name": "MissAV",
    "lang": "all",
    "baseUrl": "http://missav.ws",
    "apiUrl": "",
    "iconUrl": "https://missav.ws/img/favicon.png",
    "typeSource": "single",
    "isManga": false,
    "itemType": 1,
    "isNsfw": true,
    "version": "0.0.2",
    "apiUrl": "",
    "dateFormat": "",
    "dateFormatLocale": "",
    "pkgName": "anime/src/all/missav.js"
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
      const headers = {
        'Origin': this.source.baseUrl,
        'upgrade-insecure-requests': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
      }
      const preference = new SharedPreferences();
      if (!url.includes("https://")) {
        // const res = await new Client().get(this.source.baseUrl + '/' + preference.get("lang") + url, headers);
        const res = await new Client().get("http://missav.ws/" + preference.get("lang") + url, headers);
        return res.body;
      } else {
        const url1 = url.replace('https://', 'http://');
        const res = await new Client().get(url1, headers);
        return res.body;
      }
    }

    async getCategoryUrls() {
       const res = await this.request("/genres");
        // const res = await this.request("https://missav.ws/dm291/en/today-hot");
        const doc = new Document(res);
        const pre_categories = [
            'today-hot',
            'new',
            'english-subtitle',
            'uncensored-leak',
            'madou',
            'twav',
            'furuke',
            'klive',
            'clive',
            'fc2',
            'heyzo',
            'tokyo-hot',
            '1pondo',
            'caribbeancom',
            'caribbeancompr',
            '10musume',
            'pacopacomama',
            'gachinco',
            'xxxav',
            'marriedslash',
            'naughty4610',
            'naughty0930',
            'vr',
            'siro',
            'luxu',
            'gana',
            'maan',
            'scute',
            'ara'
        ];
        const elements = doc.select("nav a");
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
      const url1 = category;
      const res = await this.request(url1);
      const doc = new Document(res);
      const elements = doc.select(".gap-5 > div");
      const items = [];
      for (const element of elements) {
        const cover = element.selectFirst("img").attr("data-src");
        const info = element.selectFirst("a.text-secondary");
        const url = info.attr("href");
        const title = info.text.trim();
        items.push({
          link: url,
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
      return await this.getItems(`today-hot`, `?page=${page}`);
    }

    async getLatestUpdates(page) {
      return await this.getItems(`new`, `?page=${page}`);
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

    async getEpisodes(uuid, time) {
      const url = `https://surrit.com/${uuid}/playlist.m3u8`
      const ep = [{
          name: "Watch Now",
          url: url,
          dateUpload: time.toString()
        }];
      return ep;
    }

    async getDetail(url) {
      const res = await this.request(url);
      const doc = new Document(res);
      const body = doc.selectFirst("body");
      const title = body.selectFirst("h1").text.trim();
      const cover = body.selectFirst("video.player").attr("data-poster");
      const desc = body.selectFirst("div.break-all").text.trim();
      const info = body.selectFirst("div.space-y-2");
      const updateTime = this.dateStringToTimestamp(info.selectFirst("time").text);
      var author = "Unknown";
      var genres = [];
      const regex = /m3u8\|([a-f0-9\|]+)\|com\|surrit\|https\|video/;
      const match = res.match(regex);
      var uuid = "";
      if (match) {
        const parts = match[1].split("|").reverse();
        uuid = parts.join("-");
      }
      const eps = await this.getEpisodes(uuid, updateTime);
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
      const headers = {
        'Origin': this.source.baseUrl,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
      const response = await new Client().get(url, headers);
      const codigo = response.body;

      const streams = [];
      const lines = codigo.split('\n');
      const prefix = url.replace('playlist.m3u8', '').replace('video.m3u8', '');
      const stream_headers= {
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
      // sort by quality desc
      streams.sort((a, b) => parseInt(b.quality) - parseInt(a.quality));
      return streams;
    }

    getFilterList() {
      return [{
        "type": "CateFilter",
          "type_name": "SelectFilter",
          "name": "Category",
          "values": [
            {
              "value": "english-subtitle",
              "name": "English Subtitle",
              "type_name": "SelectOption"
            },
            {
              "value": "uncensored-leak",
              "name": "Uncensored leak",
              "type_name": "SelectOption"
            },
            {
              "value": "madou",
              "name": "Madou",
              "type_name": "SelectOption"
            },
            {
              "value": "twav",
              "name": "TWAV",
              "type_name": "SelectOption"
            },
            {
              "value": "furuke",
              "name": "Furuke",
              "type_name": "SelectOption"
            },
            {
              "value": "klive",
              "name": "Korean Live",
              "type_name": "SelectOption"
            },
            {
              "value": "clive",
              "name": "Chinese Live",
              "type_name": "SelectOption"
            },
            {
              "value": "fc2",
              "name": "FC2",
              "type_name": "SelectOption"
            },
            {
              "value": "heyzo",
              "name": "HEYZO",
              "type_name": "SelectOption"
            },
            {
              "value": "tokyo-hot",
              "name": "Tokyo Hot",
              "type_name": "SelectOption"
            },
            {
              "value": "1pondo",
              "name": "1pondo",
              "type_name": "SelectOption"
            },
            {
              "value": "caribbeancom",
              "name": "Caribbeancom",
              "type_name": "SelectOption"
            },
            {
              "value": "caribbeancompr",
              "name": "Caribbeancompr",
              "type_name": "SelectOption"
            },
            {
              "value": "10musume",
              "name": "10musume",
              "type_name": "SelectOption"
            },
            {
              "value": "pacopacomama",
              "name": "pacopacomama",
              "type_name": "SelectOption"
            },
            {
              "value": "gachinco",
              "name": "Gachinco",
              "type_name": "SelectOption"
            },
            {
              "value": "xxxav",
              "name": "XXX-AV",
              "type_name": "SelectOption"
            },
            {
              "value": "marriedslash",
              "name": "Married Slash",
              "type_name": "SelectOption"
            },
            {
              "value": "naughty4610",
              "name": "Naughty 4610",
              "type_name": "SelectOption"
            },
            {
              "value": "naughty0930",
              "name": "Naughty 0930",
              "type_name": "SelectOption"
            },
            {
              "value": "vr",
              "name": "VR",
              "type_name": "SelectOption"
            },
            {
              "value": "siro",
              "name": "SIRO",
              "type_name": "SelectOption"
            },
            {
              "value": "luxu",
              "name": "LUXU",
              "type_name": "SelectOption"
            },
            {
              "value": "gana",
              "name": "GANA",
              "type_name": "SelectOption"
            },
            {
              "value": "maan",
              "name": "PRESTIGE PREMIUM",
              "type_name": "SelectOption"
            },
            {
              "value": "scute",
              "name": "S-CUTE",
              "type_name": "SelectOption"
            },
            {
              "value": "ara",
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
              "value": "new",
              "name": "Recent update",
              "type_name": "SelectOption"
            },
            {
              "value": "release",
              "name": "New Releases",
              "type_name": "SelectOption"
            },
            {
              "value": "today-hot",
              "name": "Most viewed today",
              "type_name": "SelectOption"
            },
            {
              "value": "weekly-hot",
              "name": "Most viewed by week",
              "type_name": "SelectOption"
            },
            {
              "value": "monthly-hot",
              "name": "Most viewed by month",
              "type_name": "SelectOption"
            },
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
        }
      ];
    }
  }
