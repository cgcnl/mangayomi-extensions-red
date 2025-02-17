import '../../../../../../model/source.dart';

Source get milasubSource => _milasubSource;
Source _milasubSource = Source(
    name: "MilaSub",
    baseUrl: "https://www.milasub.co",
    lang: "tr",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/milasub/icon.png",
    dateFormat:"d MMMM yyyy",
    dateFormatLocale:"tr"
  );
