import '../../model/source.dart';
import 'multisrc/heancms/sources.dart';
import 'multisrc/madara/sources.dart';
import 'multisrc/mangareader/sources.dart';
import 'src/all/nhentai/sources.dart';

List<Source> dartMangasourceList = [
  ...madaraSourcesList,
  ...mangareaderSourcesList,
  ...heancmsSourcesList,
  ...nhentaiSourcesList
];
