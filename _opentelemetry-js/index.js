const { NodeSDK } = require("@opentelemetry/sdk-node");

const {
  OTLPTraceExporter
} = require("@opentelemetry/exporter-trace-otlp-proto");

const {
  getNodeAutoInstrumentations
} = require("@opentelemetry/auto-instrumentations-node");
const {
  MongoDBInstrumentation
} = require("@opentelemetry/instrumentation-mongodb");

const otelResources = require("@opentelemetry/resources");
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION
} = require("@opentelemetry/semantic-conventions");

module.exports = (serviceName, serviceVersion) => {
  const resource =
    typeof otelResources.resourceFromAttributes === "function"
      ? otelResources.resourceFromAttributes({
          [SEMRESATTRS_SERVICE_NAME]: serviceName,
          [SEMRESATTRS_SERVICE_VERSION]: serviceVersion
        })
      : new otelResources.Resource({
          [SEMRESATTRS_SERVICE_NAME]: serviceName,
          [SEMRESATTRS_SERVICE_VERSION]: serviceVersion
        });

  const sdk = new NodeSDK({
    resource,
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [
      new MongoDBInstrumentation(),
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
        "@opentelemetry/instrumentation-mongodb": { enabled: false }
      })
    ]
  });

  sdk.start();
  return sdk;
};
