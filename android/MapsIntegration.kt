package com.nexo.app.ui.maps

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

/**
 * NEXO Maps Integration - Jetpack Compose
 * Features: Real-time Location Tracking, Map Markers, and External Navigation Intent
 */

@Composable
fun NexoMapsScreen(destination: LatLng, destinationName: String) {
    val context = LocalContext.current
    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }
    
    // State for user's current location
    var userLocation by remember { mutableStateOf<LatLng?>(null) }
    
    // Camera state
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(destination, 15f)
    }

    // Permission Launcher
    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions.values.all { it }
        if (granted) {
            // Permission granted, fetch location
            fetchCurrentLocation(context, fusedLocationClient) { location ->
                userLocation = location
            }
        } else {
            Toast.makeText(context, "Location permission denied", Toast.LENGTH_SHORT).show()
        }
    }

    // Check permissions on launch
    LaunchedEffect(Unit) {
        if (hasLocationPermission(context)) {
            fetchCurrentLocation(context, fusedLocationClient) { location ->
                userLocation = location
            }
        } else {
            locationPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            properties = MapProperties(
                isMyLocationEnabled = hasLocationPermission(context),
                mapType = MapType.NORMAL
            ),
            uiSettings = MapUiSettings(
                myLocationButtonEnabled = true,
                zoomControlsEnabled = false
            )
        ) {
            // Destination Marker
            Marker(
                state = MarkerState(position = destination),
                title = destinationName,
                snippet = "Your destination"
            )
        }

        // Floating Action Button to Start Navigation
        FloatingActionButton(
            onClick = { launchGoogleMapsNavigation(context, destination) },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp),
            containerColor = MaterialTheme.colorScheme.primary
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Navigation, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text("Start Navigation")
            }
        }
    }
}

/**
 * Helper function to check location permissions
 */
private fun hasLocationPermission(context: Context): Boolean {
    return ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED
}

/**
 * Fetches the current location using FusedLocationProviderClient
 */
private fun fetchCurrentLocation(
    context: Context,
    fusedLocationClient: com.google.android.gms.location.FusedLocationProviderClient,
    onLocationReceived: (LatLng) -> Unit
) {
    try {
        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            location?.let {
                onLocationReceived(LatLng(it.latitude, it.longitude))
            }
        }
    } catch (e: SecurityException) {
        // Handle exception
    }
}

/**
 * Launches the Google Maps app with directions to the destination
 */
fun launchGoogleMapsNavigation(context: Context, destination: LatLng) {
    val gmmIntentUri = Uri.parse("google.navigation:q=${destination.latitude},${destination.longitude}")
    val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
    mapIntent.setPackage("com.google.android.apps.maps")
    
    if (mapIntent.resolveActivity(context.packageManager) != null) {
        context.startActivity(mapIntent)
    } else {
        // Fallback if Google Maps app is not installed
        val browserIntent = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}")
        )
        context.startActivity(browserIntent)
    }
}
