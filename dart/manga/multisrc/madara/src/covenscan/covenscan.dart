import '../../../../../../model/source.dart';

Source get covenscanSource => _covenscanSource;
Source _covenscanSource = Source(
    name: "Coven Scan",
    baseUrl: "https://cvnscan.com",
    lang: "pt-br",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/covenscan/icon.png",
    dateFormat:"MMMM dd, yyyy",
    dateFormatLocale:"pt-br"
  );
