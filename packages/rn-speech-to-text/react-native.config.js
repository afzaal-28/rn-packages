module.exports = {
  dependency: {
    platforms: {
      android: {
        packageImportPath: 'import com.rnspeechtotext.RNSpeechToTextPackage;',
        packageInstance: 'new RNSpeechToTextPackage()',
      },
      ios: {
        sourceDir: './ios',
      },
    },
  },
};
