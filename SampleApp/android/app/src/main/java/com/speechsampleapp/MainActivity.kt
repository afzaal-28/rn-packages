package com.speechsampleapp

import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : FragmentActivity() {

    private var reactActivityDelegate: ReactActivityDelegate? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        reactActivityDelegate = DefaultReactActivityDelegate(
            this,
            "SpeechSampleApp",
            fabricEnabled
        )
    }

    override fun getMainComponentName(): String = "SpeechSampleApp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        reactActivityDelegate!!
}
