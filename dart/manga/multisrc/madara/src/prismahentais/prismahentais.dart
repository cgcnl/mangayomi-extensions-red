import '../../../../../../model/source.dart';

  Source get prismahentaisSource => _prismahentaisSource;
            
  Source _prismahentaisSource = Source(
    name: "Prisma Hentais",
    baseUrl: "https://prismahentai.com",
    lang: "pt-BR",
    isNsfw:true,
    typeSource: "madara",
    iconUrl:"https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/madara/src/prismahentais/icon.png",
    dateFormat:"dd 'de' MMMMM 'de' yyyy",
    dateFormatLocale:"pt-br",
  );