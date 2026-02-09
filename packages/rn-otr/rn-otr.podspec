require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'rn-otr'
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = 'https://github.com/afzaal/rn-packages'
  s.license      = package['license']
  s.authors      = { package['author'] => '' }
  s.platforms    = { :ios => '13.0' }
  s.source       = { :git => 'https://github.com/afzaal/rn-packages.git', :tag => s.version.to_s }

  s.source_files = 'ios/**/*.{h,m,mm,swift}'

  s.swift_version = '5.0'

  s.dependency 'React-Core'
  s.frameworks = 'AVFoundation', 'Vision'
end
