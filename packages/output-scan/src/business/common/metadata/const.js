const { chain: { getApi } } = require("@osn/scan-common");

function getConstFromRegistry(registry, moduleName, constantName) {
  let iterVersion = 0;
  const metadata = registry.metadata.get("metadata");

  while (iterVersion < 1000) {
    if (!metadata[`isV${iterVersion}`]) {
      iterVersion++;
      continue;
    }

    const modules = metadata[`asV${iterVersion}`].get("modules");
    const targetModule = modules.find(
      (module) => module.name.toString() === moduleName
    );
    if (!targetModule) {
      // TODO: should throw error
      break;
    }

    const targetConstant = targetModule.constants.find(
      (constant) => constant.name.toString() === constantName
    );
    if (!targetConstant) {
      break;
    }

    const typeName = targetConstant.type.toString();
    const Type = registry.registry.get(typeName);
    return new Type(registry.registry, targetConstant.value);
  }

  return null;
}

async function getMetadataConstsByBlockHash(blockHash, constants) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);
  return constants.map(({ moduleName, constantName }) =>
    getConstFromRegistry(registry, moduleName, constantName)
  );
}

module.exports = {
  getMetadataConstsByBlockHash,
}
