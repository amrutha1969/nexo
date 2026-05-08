package com.nexo.app.engine

import java.time.LocalDateTime
import java.time.Duration

/**
 * NEXO Smart Arrival Engine - Kotlin Implementation
 * 
 * This engine calculates the optimal time a user should leave their current location
 * to arrive at a service center exactly when their token is called.
 */

data class QueueData(
    val userToken: Int,
    val currentServingToken: Int,
    val avgServiceTimeMinutes: Int
)

data class TravelData(
    val baseTravelTimeMinutes: Int,
    val trafficDelayMinutes: Int,
    val safetyBufferMinutes: Int = 5
)

data class SmartArrivalResult(
    val peopleAhead: Int,
    val estimatedWaitTimeMinutes: Int,
    val expectedTurnTime: LocalDateTime,
    val suggestedDepartureTime: LocalDateTime,
    val totalTravelDurationMinutes: Int,
    val isTimeReached: Boolean
)

class SmartArrivalEngine {

    /**
     * Calculates the smart arrival metrics.
     * 
     * @param queueData Information about the current queue status
     * @param travelData Information about travel time and traffic
     * @param currentTime The reference time (defaults to LocalDateTime.now())
     * @return SmartArrivalResult containing calculated times and counts
     */
    fun calculate(
        queueData: QueueData,
        travelData: TravelData,
        currentTime: LocalDateTime = LocalDateTime.now()
    ): SmartArrivalResult {
        
        // 1. Calculate people ahead in the queue
        val peopleAhead = (queueData.userToken - queueData.currentServingToken).coerceAtLeast(0)
        
        // 2. Estimate wait time based on average service time
        val estimatedWaitTimeMinutes = peopleAhead * queueData.avgServiceTimeMinutes
        
        // 3. Calculate the expected time the user's token will be called
        val expectedTurnTime = currentTime.plusMinutes(estimatedWaitTimeMinutes.toLong())
        
        // 4. Calculate total travel duration including traffic and safety buffer
        val totalTravelDurationMinutes = travelData.baseTravelTimeMinutes + 
                                       travelData.trafficDelayMinutes + 
                                       travelData.safetyBufferMinutes
        
        // 5. Calculate suggested departure time
        val suggestedDepartureTime = expectedTurnTime.minusMinutes(totalTravelDurationMinutes.toLong())
        
        // 6. Check if it's already past the suggested departure time
        val isTimeReached = currentTime.isAfter(suggestedDepartureTime)
        
        return SmartArrivalResult(
            peopleAhead = peopleAhead,
            estimatedWaitTimeMinutes = estimatedWaitTimeMinutes,
            expectedTurnTime = expectedTurnTime,
            suggestedDepartureTime = suggestedDepartureTime,
            totalTravelDurationMinutes = totalTravelDurationMinutes,
            isTimeReached = isTimeReached
        )
    }
}

/**
 * Example Usage:
 * 
 * val engine = SmartArrivalEngine()
 * val result = engine.calculate(
 *     queueData = QueueData(userToken = 45, currentServingToken = 20, avgServiceTimeMinutes = 5),
 *     travelData = TravelData(baseTravelTimeMinutes = 15, trafficDelayMinutes = 3)
 * )
 * 
 * println("Suggested Departure: ${result.suggestedDepartureTime}")
 */
