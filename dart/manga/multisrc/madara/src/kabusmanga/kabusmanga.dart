import '../../../../../../model/source.dart';

Source get kabusmangaSource => _kabusmangaSource;
Source _kabusmangaSource = Source(
    name: "Kabus Manga",
    baseUrl: "https://kabusmanga.com",
    lang: "tr",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/kabusmanga/icon.png",
    dateFormat:"dd/MM/yyyy",
    dateFormatLocale:"en"
  );
