import '../../../../../../model/source.dart';

Source get doujinzaSource => _doujinzaSource;
Source _doujinzaSource = Source(
    name: "DoujinZa",
    baseUrl: "https://doujinza.com",
    lang: "th",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/doujinza/icon.png",
    dateFormat:"MMMM d, yyyy",
    dateFormatLocale:"th"
  );
