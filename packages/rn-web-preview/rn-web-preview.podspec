Pod::Spec.new do |s|
  s.name             = 'rn-web-preview'
  s.version          = '0.1.0'
  s.summary          = 'React Native web preview library'
  s.description      = <<-DESC
                          A React Native native module for web preview 
                          with advanced features for Android and iOS.
                          DESC
  s.homepage         = 'https://github.com/afzaal/rn-web-preview'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'afzaal' => 'afzaal@example.com' }
  s.platforms        = { :ios => '12.0' }
  s.source           = { :git => 'https://github.com/afzaal/rn-web-preview.git', :tag => s.version.to_s }
  s.source_files     = 'ios/**/*.{h,m}'
  s.dependency       'React-Core'
end
