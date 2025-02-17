import '../../../../model/source.dart';
import 'src/yugenmangas/yugenmangas.dart';
import 'src/omegascans/omegascans.dart';
import 'src/perfscan/perfscan.dart';

const heancmsVersion = "0.0.75";
const heancmsSourceCodeUrl =
    "https://raw.githubusercontent.com/cgcnl/mangayomi-extensions-red/$branchName/dart/manga/multisrc/heancms/heancms.dart";

List<Source> get heancmsSourcesList => _heancmsSourcesList;
List<Source> _heancmsSourcesList = [
//YugenMangas (ES)
  yugenmangasSource,
//OmegaScans (EN)
  omegascansSource,
//Perf Scan (FR)
  perfscanSource,
]
    .map((e) => e
      ..itemType = ItemType.manga
      ..sourceCodeUrl = heancmsSourceCodeUrl
      ..version = heancmsVersion)
    .toList();
