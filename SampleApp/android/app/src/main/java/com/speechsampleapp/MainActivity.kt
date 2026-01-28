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
        reactActivityDelegate?.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        reactActivityDelegate?.onDestroy()
    }

    override fun onPause() {
        super.onPause()
        reactActivityDelegate?.onPause()
    }

    override fun onResume() {
        super.onResume()
        reactActivityDelegate?.onResume()
    }

    override fun onStart() {
        super.onStart()
        reactActivityDelegate?.onStart()
    }

    override fun onStop() {
        super.onStop()
        reactActivityDelegate?.onStop()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: android.content.Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        reactActivityDelegate?.onActivityResult(requestCode, resultCode, data)
    }

    fun createReactActivityDelegate(): ReactActivityDelegate =
        reactActivityDelegate!!
}
