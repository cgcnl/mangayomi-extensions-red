import '../../../../../../model/source.dart';

  Source get girlslovemangaSource => _girlslovemangaSource;
            
  Source _girlslovemangaSource = Source(
    name: "Girls Love Manga!",
    baseUrl: "https://glmanga.com",
    lang: "en",
    isNsfw:true,
    typeSource: "madara",
    iconUrl:"https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/madara/src/girlslovemanga/icon.png",
    dateFormat:"MMMM dd, yyyy",
    dateFormatLocale:"en_us",
  );