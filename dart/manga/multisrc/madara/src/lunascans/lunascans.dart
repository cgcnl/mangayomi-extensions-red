import '../../../../../../model/source.dart';

Source get lunascansSource => _lunascansSource;
Source _lunascansSource = Source(
    name: "Luna Scans",
    baseUrl: "https://lunascans.fun",
    lang: "tr",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/lunascans/icon.png",
    dateFormat:"d MMMM yyyy",
    dateFormatLocale:"tr"
  );
