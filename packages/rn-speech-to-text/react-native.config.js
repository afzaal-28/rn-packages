module.exports = {
  dependency: {
    platforms: {
      android: {
        packageImportPath: 'import com.rnspeechtotext.RNSpeechToTextPackage;',
        packageInstance: 'new RNSpeechToTextPackage()',
      },
      ios: {
        project: './ios/RNSpeechToText.xcodeproj',
      },
    },
  },
};
