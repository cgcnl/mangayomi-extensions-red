import '../../../../../../model/source.dart';

Source get instamanhwaSource => _instamanhwaSource;
Source _instamanhwaSource = Source(
    name: "InstaManhwa",
    baseUrl: "https://www.instamanhwa.com",
    lang: "en",
    isNsfw:true,
    typeSource: "madara",
    iconUrl: "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/main/dart/manga/multisrc/madara/src/instamanhwa/icon.png",
    dateFormat:"dd MMMM, yyyy",
    dateFormatLocale:"en_us"
  );
