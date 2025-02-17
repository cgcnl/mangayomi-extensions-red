import '../../../../../../model/source.dart';

  Source get apolltoonsSource => _apolltoonsSource;
            
  Source _apolltoonsSource = Source(
    name: "Apolltoons",
    baseUrl: "https://apolltoons.xyz",
    lang: "es",
    isNsfw:true,
    typeSource: "madara",
    iconUrl:"https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/madara/src/apolltoons/icon.png",
    dateFormat:"dd MMMMM, yyyy",
    dateFormatLocale:"es",
  );