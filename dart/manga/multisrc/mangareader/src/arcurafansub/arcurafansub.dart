import '../../../../../../model/source.dart';

Source get arcurafansubSource => _arcurafansubSource;
Source _arcurafansubSource = Source(
    name: "Arcura Fansub",
    baseUrl: "https://arcurafansub.com",
    lang: "tr",
    isNsfw:true,
    typeSource: "mangareader",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/mangareader/src/arcurafansub/icon.png",
    dateFormat:"MMMM d, yyy",
    dateFormatLocale:"tr"
  );
