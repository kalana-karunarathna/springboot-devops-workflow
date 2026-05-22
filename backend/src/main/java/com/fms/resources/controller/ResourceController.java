package com.fms.resources.controller;

import com.fms.resources.model.Resource;
import com.fms.resources.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;
    
    // Get all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }
    
    // Get resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Optional<Resource> resource = resourceService.getResourceById(id);
        return resource.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new resource
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        try {
            Resource createdResource = resourceService.createResource(resource);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update resource
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @Valid @RequestBody Resource resource) {
        try {
            Optional<Resource> updatedResource = resourceService.updateResource(id, resource);
            return updatedResource.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Delete resource
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        boolean deleted = resourceService.deleteResource(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Search resources
    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {
        
        List<Resource> resources = resourceService.searchResources(searchTerm, type, capacity, location, status);
        return ResponseEntity.ok(resources);
    }
    
    // Get resources by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Resource>> getResourcesByType(@PathVariable String type) {
        List<Resource> resources = resourceService.getResourcesByType(type);
        return ResponseEntity.ok(resources);
    }
    
    // Get resources by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<Resource>> getResourcesByLocation(@PathVariable String location) {
        List<Resource> resources = resourceService.getResourcesByLocation(location);
        return ResponseEntity.ok(resources);
    }
    
    // Get resources by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Resource>> getResourcesByStatus(@PathVariable String status) {
        List<Resource> resources = resourceService.getResourcesByStatus(status);
        return ResponseEntity.ok(resources);
    }
    
    // Get active resources
    @GetMapping("/active")
    public ResponseEntity<List<Resource>> getActiveResources() {
        List<Resource> resources = resourceService.getActiveResources();
        return ResponseEntity.ok(resources);
    }
    
    // Get resource statistics
    @GetMapping("/stats")
    public ResponseEntity<ResourceService.ResourceStats> getResourceStats() {
        ResourceService.ResourceStats stats = resourceService.getResourceStats();
        return ResponseEntity.ok(stats);
    }
    
    // Get dropdown options
    @GetMapping("/options")
    public ResponseEntity<ResourceOptions> getResourceOptions() {
        ResourceOptions options = new ResourceOptions();
        return ResponseEntity.ok(options);
    }
    
    // Inner class for dropdown options
    public static class ResourceOptions {
        private List<String> types = List.of("Lecture Hall", "Lab", "Meeting Room", "Equipment");
        private List<Integer> capacities = List.of(10, 50, 100, 200);
        private List<String> locations = List.of("Engineering Building", "Business Management Building", "New Building", "Main Building");
        private List<String> statuses = List.of("Active", "Out Of Service");
        
        // Getters
        public List<String> getTypes() { return types; }
        public List<Integer> getCapacities() { return capacities; }
        public List<String> getLocations() { return locations; }
        public List<String> getStatuses() { return statuses; }
    }
}
