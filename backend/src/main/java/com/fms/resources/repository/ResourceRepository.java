package com.fms.resources.repository;

import com.fms.resources.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    // Find resources by type
    List<Resource> findByType(String type);
    
    // Find resources by location
    List<Resource> findByLocation(String location);
    
    // Find resources by status
    List<Resource> findByStatus(String status);
    
    // Find resources by capacity range
    @Query("{ 'capacity': { $gte: ?0, $lte: ?1 } }")
    List<Resource> findByCapacityBetween(Integer minCapacity, Integer maxCapacity);
    
    // Find resources by name (case-insensitive)
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Resource> findByNameContaining(String name);
    
    // Find active resources
    List<Resource> findByStatusIgnoreCase(String status);
    
        
    // Count resources by type
    long countByType(String type);
    
    // Count resources by location
    long countByLocation(String location);
    
    // Count resources by status
    long countByStatus(String status);
    
    // Check if resource exists by name
    boolean existsByNameIgnoreCase(String name);
}
