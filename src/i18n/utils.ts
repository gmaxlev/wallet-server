import * as fsp from 'fs/promises';
import * as path from 'path';

export async function parseLocalesDirectory(resourcesPath) {
  const list: Array<{
    lng: string;
    namespace: string;
    content: any;
  }> = [];

  const files = await fsp.readdir(resourcesPath);

  for (const lng of files) {
    const namespaces = await fsp.readdir(path.join(resourcesPath, lng));

    for (const namespace of namespaces) {
      const content = await fsp.readFile(
        path.join(resourcesPath, lng, namespace),
      );
      list.push({
        lng,
        namespace: path.parse(namespace).name,
        content: JSON.parse(content.toString()),
      });
    }
  }

  return list;
}
