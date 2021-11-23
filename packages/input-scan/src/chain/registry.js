const { getApi } = require("./api");
const { TypeRegistry, Metadata } = require("@polkadot/types");
const {
  getSpecTypes,
  getSpecAlias,
} = require("@polkadot/types-known");

async function getRegistryByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const [runtimeVersion, chain, properties] = await Promise.all([
    api.rpc.state.getRuntimeVersion(blockHash),
    api.rpc.system.chain(),
    api.rpc.system.properties(),
  ]);

  const registry = new TypeRegistry(blockHash);
  const rawMetadata = await api.rpc.state.getMetadata(blockHash);
  const metadata = new Metadata(registry, rawMetadata);

  registry.setChainProperties(properties);
  registry.register(
    getSpecTypes(
      registry,
      chain,
      runtimeVersion.specName,
      runtimeVersion.specVersion
    )
  );

  if (registry.knownTypes.typesBundle) {
    registry.knownTypes.typesAlias = getSpecAlias(
      registry,
      chain,
      runtimeVersion.specName
    );
  }

  registry.setMetadata(metadata, undefined, {});

  return registry;
}

module.exports = {
  getRegistryByHeight,
};
