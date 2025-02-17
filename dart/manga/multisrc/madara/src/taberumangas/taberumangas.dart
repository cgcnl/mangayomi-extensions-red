import '../../../../../../model/source.dart';

  Source get taberumangasSource => _taberumangasSource;
            
  Source _taberumangasSource = Source(
    name: "Taberu Mangás",
    baseUrl: "https://taberu.org",
    lang: "pt-BR",
    isNsfw:true,
    typeSource: "madara",
    iconUrl:"https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/madara/src/taberumangas/icon.png",
    dateFormat:"dd/MM/yyyy",
    dateFormatLocale:"pt-br",
  );