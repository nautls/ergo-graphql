export const checkHealth = () => {
  const checks = {};

  const healthy = Object.values(checks).every(() => true);

  return {
    msg: "Custom message",
    healthy
  }
};
