import '../../../../../../model/source.dart';

Source get flowermangaSource => _flowermangaSource;
Source _flowermangaSource = Source(
    name: "Flower Manga",
    baseUrl: "https://flowermanga.net",
    lang: "pt-br",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/flowermanga/icon.png",
    dateFormat:"d 'de' MMMMM 'de' yyyy",
    dateFormatLocale:"pt-br"
  );
