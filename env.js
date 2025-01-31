const envConfig = {
  copb2b: {
    staging: '',
    production: '',
  },
  gaba: {
    fr: {
      staging: '',
      production: '',
      qa:'',
    },
    de: {
      staging: '',
      production: '',
    },
  },

};
 
const getEnvironment = (project) => {
  const availableEnvironments = ['production', 'staging', 'qa', 'dev'];
  return availableEnvironments.find(env => project?.toLowerCase().includes(env)) || 'staging';
};
const getBaseUrl = (project) => {
  const [product, language, browser, environment] = project.split('-');
  const finalEnvironment = getEnvironment(project);
 
  if (project.includes('mobile')) {
    console.log(`Running mobile tests for ${product}, using the same URL as desktop.`);
    if (envConfig[product]) {
      const productConfig = envConfig[product];
      if (productConfig[language]) {
        return productConfig[language][finalEnvironment] || productConfig[language].staging;
      }
      return productConfig[finalEnvironment] || productConfig.staging;
    }
  }
  if (envConfig[product]) {
    const productConfig = envConfig[product];
    // Check if there's a language-specific configuration
    if (productConfig[language]) {
      return productConfig[language][finalEnvironment] || productConfig[language].staging;  // Default to staging if the environment is not found
    }
    // Return the environment-specific URL for products without language configuration
    return productConfig[finalEnvironment] || productConfig.staging;
  }
 
  console.error(`Product ${product} is not supported.`);
  return '';  
};
 
module.exports = { getBaseUrl };