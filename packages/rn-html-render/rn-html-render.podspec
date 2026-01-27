Pod::Spec.new do |s|
  s.name             = 'rn-html-render'
  s.version          = '0.1.0'
  s.summary          = 'React Native HTML renderer library'
  s.description      = <<-DESC
                          A React Native native module for HTML rendering 
                          with advanced features for Android and iOS.
                          DESC
  s.homepage         = 'https://github.com/afzaal/rn-html-render'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'afzaal' => 'afzaal@example.com' }
  s.platforms        = { :ios => '12.0' }
  s.source           = { :git => 'https://github.com/afzaal/rn-html-render.git', :tag => s.version.to_s }
  s.source_files     = 'ios/**/*.{h,m}'
  s.dependency       'React-Core'
end
