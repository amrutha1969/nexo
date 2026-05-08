package com.nexo.app.ui.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapUiSettings
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.rememberCameraPositionState

/**
 * NEXO Home Screen - Jetpack Compose Implementation
 * Features: Material 3, Google Maps Integration, Nearby Services List
 */

data class Business(
    val id: String,
    val name: String,
    val category: String,
    val address: String,
    val latLng: LatLng,
    val waitingCount: Int,
    val avgWaitTime: Int,
    val isOpen: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NexoHomeScreen() {
    val nearbyBusinesses = remember {
        listOf(
            Business("1", "City General Hospital", "Hospital", "123 Health Ave", LatLng(40.7128, -74.0060), 26, 15, true),
            Business("2", "Global Trust Bank", "Bank", "456 Finance St", LatLng(40.7306, -73.9352), 12, 8, true),
            Business("3", "The Royal Salon", "Salon", "789 Style Rd", LatLng(40.7589, -73.9851), 5, 30, true)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            modifier = Modifier.size(32.dp),
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.primary
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("N", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                        Spacer(Modifier.width(8.dp))
                        Text("NEXO", fontWeight = FontWeight.ExtraBold, letterSpacing = (-1).sp)
                    }
                },
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.AccountCircle, contentDescription = "Profile")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF8F9FC))
        ) {
            // 1. Map Section
            MapSection(modifier = Modifier.height(240.dp), businesses = nearbyBusinesses)

            // 2. Search & List Section
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Spacer(Modifier.height(20.dp))
                
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search services...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    shape = RoundedCornerShape(16.dp),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        containerColor = Color.White,
                        unfocusedBorderColor = Color(0xFFF0F0F0)
                    )
                )

                Spacer(Modifier.height(24.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Nearby Services", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    TextButton(onClick = {}) {
                        Text("See All")
                    }
                }

                Spacer(Modifier.height(12.dp))

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    contentPadding = PaddingValues(bottom = 24.dp)
                ) {
                    items(nearbyBusinesses) { business ->
                        BusinessCard(business = business)
                    }
                }
            }
        }
    }
}

@Composable
fun MapSection(modifier: Modifier = Modifier, businesses: List<Business>) {
    val singapore = LatLng(40.7128, -74.0060)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(singapore, 12f)
    }

    Box(modifier = modifier.clip(RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp))) {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            uiSettings = MapUiSettings(zoomControlsEnabled = false)
        ) {
            businesses.forEach { business ->
                Marker(
                    state = MarkerState(position = business.latLng),
                    title = business.name,
                    snippet = "${business.waitingCount} in queue"
                )
            }
        }
    }
}

@Composable
fun BusinessCard(business: Business) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Placeholder for Image
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFFF0F0F0)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Place, contentDescription = null, tint = Color.LightGray)
            }

            Spacer(Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = if (business.isOpen) Color(0xFFE8F5E9) else Color(0xFFFFEBEE),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = if (business.isOpen) "OPEN" else "CLOSED",
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = if (business.isOpen) Color(0xFF2E7D32) else Color(0xFFC62828),
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(Modifier.width(8.dp))
                    Text("1.2 km", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }

                Text(
                    text = business.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color.Gray)
                    Text(" ${business.waitingCount} waiting", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    Spacer(Modifier.width(12.dp))
                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color.Gray)
                    Text(" ${business.avgWaitTime}m avg", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
            }

            Button(
                onClick = { },
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Text("Join", fontWeight = FontWeight.Bold)
            }
        }
    }
}
