import '../../../../../../model/source.dart';

  Source get hiperdexSource => _hiperdexSource;
            
  Source _hiperdexSource = Source(
    name: "Hiperdex",
    baseUrl: "https://hiperdex.com",
    lang: "en",
    isNsfw:true,
    typeSource: "madara",
    iconUrl:"https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/madara/src/hiperdex/icon.png",
    dateFormat:"MMMM dd, yyyy",
    dateFormatLocale:"en_us",
  );