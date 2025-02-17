import '../../../../../../model/source.dart';

  Source get mangalandSource => _mangalandSource;
            
  Source _mangalandSource = Source(
    name: "Mangaland",
    baseUrl: "https://mangaland.net",
    lang: "es",
    isNsfw:true,
    typeSource: "madara",
    iconUrl:"https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/madara/src/mangaland/icon.png",
    dateFormat:"MMMM dd, yyyy",
    dateFormatLocale:"es",
  );