package com.fms.resources.service;

import com.fms.resources.model.Resource;
import com.fms.resources.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResourceService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    // Get all resources
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }
    
    // Get resource by ID
    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }
    
    // Create new resource
    public Resource createResource(Resource resource) {
        // Validate resource type
        if (!isValidType(resource.getType())) {
            throw new IllegalArgumentException("Invalid resource type. Must be one of: Lecture Hall, Lab, Meeting Room, Equipment");
        }
        
        // Validate capacity (allow null for "None")
        if (resource.getCapacity() != null && !isValidCapacity(resource.getCapacity())) {
            throw new IllegalArgumentException("Invalid capacity. Must be one of: None, 10, 50, 100, 200");
        }
        
        // Validate location
        if (!isValidLocation(resource.getLocation())) {
            throw new IllegalArgumentException("Invalid location. Must be one of: Engineering Building, Business Management Building, New Building, Main Building");
        }
        
        // Validate status
        if (!isValidStatus(resource.getStatus())) {
            throw new IllegalArgumentException("Invalid status. Must be one of: Active, Out Of Service");
        }
        
        // Check if resource name already exists
        if (resourceRepository.existsByNameIgnoreCase(resource.getName())) {
            throw new IllegalArgumentException("Resource with name '" + resource.getName() + "' already exists");
        }
        
        return resourceRepository.save(resource);
    }
    
    // Update resource
    public Optional<Resource> updateResource(String id, Resource resourceDetails) {
        return resourceRepository.findById(id).map(resource -> {
            // Validate resource type
            if (!isValidType(resourceDetails.getType())) {
                throw new IllegalArgumentException("Invalid resource type. Must be one of: Lecture Hall, Lab, Meeting Room, Equipment");
            }
            
            // Validate capacity (allow null for "None")
            if (resourceDetails.getCapacity() != null && !isValidCapacity(resourceDetails.getCapacity())) {
                throw new IllegalArgumentException("Invalid capacity. Must be one of: None, 10, 50, 100, 200");
            }
            
            // Validate location
            if (!isValidLocation(resourceDetails.getLocation())) {
                throw new IllegalArgumentException("Invalid location. Must be one of: Engineering Building, Business Management Building, New Building, Main Building");
            }
            
            // Validate status
            if (!isValidStatus(resourceDetails.getStatus())) {
                throw new IllegalArgumentException("Invalid status. Must be one of: Active, Out Of Service");
            }
            
            // Check if name is being changed and if new name already exists
            if (!resource.getName().equalsIgnoreCase(resourceDetails.getName()) && 
                resourceRepository.existsByNameIgnoreCase(resourceDetails.getName())) {
                throw new IllegalArgumentException("Resource with name '" + resourceDetails.getName() + "' already exists");
            }
            
            resource.setName(resourceDetails.getName());
            resource.setType(resourceDetails.getType());
            resource.setCapacity(resourceDetails.getCapacity());
            resource.setLocation(resourceDetails.getLocation());
            resource.setStatus(resourceDetails.getStatus());
            resource.setDescription(resourceDetails.getDescription());
            
            return resourceRepository.save(resource);
        });
    }
    
    // Delete resource
    public boolean deleteResource(String id) {
        if (resourceRepository.existsById(id)) {
            resourceRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Search resources
    public List<Resource> searchResources(String searchTerm, String type, Integer capacity, String location, String status) {
        List<Resource> resources = resourceRepository.findAll();
        
        // Filter by search term (name, type, location)
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            resources = resources.stream()
                .filter(r -> r.getName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                           r.getType().toLowerCase().contains(searchTerm.toLowerCase()) ||
                           r.getLocation().toLowerCase().contains(searchTerm.toLowerCase()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Filter by type
        if (type != null && !type.trim().isEmpty()) {
            resources = resources.stream()
                .filter(r -> r.getType().equals(type))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Filter by capacity
        if (capacity != null) {
            resources = resources.stream()
                .filter(r -> capacity.equals(r.getCapacity()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Filter by location
        if (location != null && !location.trim().isEmpty()) {
            resources = resources.stream()
                .filter(r -> r.getLocation().equals(location))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Filter by status
        if (status != null && !status.trim().isEmpty()) {
            resources = resources.stream()
                .filter(r -> r.getStatus().equals(status))
                .collect(java.util.stream.Collectors.toList());
        }
        
        return resources;
    }
    
    // Get resources by type
    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }
    
    // Get resources by location
    public List<Resource> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location);
    }
    
    // Get resources by status
    public List<Resource> getResourcesByStatus(String status) {
        return resourceRepository.findByStatus(status);
    }
    
    // Get active (bookable) resources
    public List<Resource> getActiveResources() {
        return resourceRepository.findByStatusIgnoreCase("Active");
    }
    
    // Get resource statistics
    public ResourceStats getResourceStats() {
        ResourceStats stats = new ResourceStats();
        stats.setTotalResources(resourceRepository.count());
        stats.setActiveResources(resourceRepository.countByStatus("Active"));
        stats.setOutOfServiceResources(resourceRepository.countByStatus("Out Of Service"));
        
        // Count by type
        stats.setLectureHallCount(resourceRepository.countByType("Lecture Hall"));
        stats.setLabCount(resourceRepository.countByType("Lab"));
        stats.setMeetingRoomCount(resourceRepository.countByType("Meeting Room"));
        stats.setEquipmentCount(resourceRepository.countByType("Equipment"));
        
        return stats;
    }
    
    // Validation helper methods
    private boolean isValidType(String type) {
        List<String> validTypes = List.of("Lecture Hall", "Lab", "Meeting Room", "Equipment");
        return validTypes.contains(type);
    }
    
    private boolean isValidCapacity(Integer capacity) {
        if (capacity == null) {
            return true; // Allow null for "None"
        }
        List<Integer> validCapacities = List.of(10, 50, 100, 200);
        return validCapacities.contains(capacity);
    }
    
    private boolean isValidLocation(String location) {
        List<String> validLocations = List.of("Engineering Building", "Business Management Building", "New Building", "Main Building");
        return validLocations.contains(location);
    }
    
    private boolean isValidStatus(String status) {
        List<String> validStatuses = List.of("Active", "Out Of Service");
        return validStatuses.contains(status);
    }
    
    // Inner class for statistics
    public static class ResourceStats {
        private long totalResources;
        private long activeResources;
        private long outOfServiceResources;
        private long lectureHallCount;
        private long labCount;
        private long meetingRoomCount;
        private long equipmentCount;
        
        // Getters and Setters
        public long getTotalResources() { return totalResources; }
        public void setTotalResources(long totalResources) { this.totalResources = totalResources; }
        
        public long getActiveResources() { return activeResources; }
        public void setActiveResources(long activeResources) { this.activeResources = activeResources; }
        
        public long getOutOfServiceResources() { return outOfServiceResources; }
        public void setOutOfServiceResources(long outOfServiceResources) { this.outOfServiceResources = outOfServiceResources; }
        
        public long getLectureHallCount() { return lectureHallCount; }
        public void setLectureHallCount(long lectureHallCount) { this.lectureHallCount = lectureHallCount; }
        
        public long getLabCount() { return labCount; }
        public void setLabCount(long labCount) { this.labCount = labCount; }
        
        public long getMeetingRoomCount() { return meetingRoomCount; }
        public void setMeetingRoomCount(long meetingRoomCount) { this.meetingRoomCount = meetingRoomCount; }
        
        public long getEquipmentCount() { return equipmentCount; }
        public void setEquipmentCount(long equipmentCount) { this.equipmentCount = equipmentCount; }
    }
}
