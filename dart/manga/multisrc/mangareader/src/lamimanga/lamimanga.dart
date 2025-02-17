import '../../../../../../model/source.dart';

Source get lamimangaSource => _lamimangaSource;
Source _lamimangaSource = Source(
    name: "Lami-Manga",
    baseUrl: "https://www.lami-manga.com",
    lang: "th",
    isNsfw:true,
    typeSource: "mangareader",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/mangareader/src/lamimanga/icon.png",
    dateFormat:"MMMM d, yyyy",
    dateFormatLocale:"th"
  );
