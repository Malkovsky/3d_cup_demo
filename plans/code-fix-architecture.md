# Code Fix Architecture - 3D Cup Visualization

## Current vs. Proposed Structure

### Current File Structure (BROKEN)
```
main.js (874 lines)
├── Imports & Setup (lines 1-51)
├── createCup function (lines 53-140)
├── Initialize default cup (line 143)
├── Upload handlers (lines 146-181)
├── Animation loop (lines 184-192)
├── Resize handler (lines 195-199)
├── Start animation (line 202)
└── DUPLICATED CODE (lines 203-874) ❌
    ├── Same validation logic repeated 10+ times
    ├── Same upload handler repeated 10+ times
    ├── Same animation loop repeated 10+ times
    ├── Same resize handler repeated 10+ times
    └── Multiple animate() calls
```

### Proposed File Structure (FIXED)
```
main.js (~240 lines)
├── Imports & Setup (lines 1-51)
├── State Management (NEW)
│   └── isLoading flag
├── createCup function (IMPROVED)
│   ├── Loading state check
│   ├── Texture loading
│   ├── Proper disposal (geometry + materials + textures)
│   └── Better error handling
├── Initialize default cup
├── Upload handlers (IMPROVED)
│   ├── File validation
│   ├── Object URL creation
│   └── Input reset
├── Animation loop (SINGLE)
├── Resize handler (SINGLE)
└── Start animation (SINGLE CALL)
```

## Memory Management Flow

### Current Flow (Memory Leak)
```mermaid
graph LR
    A[User Uploads Image] --> B[Create New Texture]
    B --> C[Create New Material]
    C --> D[Create New Mesh]
    D --> E[Old Mesh Removed]
    E --> F[Old Geometry Disposed]
    F --> G[Old Material Disposed]
    G --> H[Old Texture NOT Disposed]
    H --> I[Memory Leak]
    
    style H fill:#ff6b6b
    style I fill:#ff6b6b
```

### Proposed Flow (No Memory Leak)
```mermaid
graph LR
    A[User Uploads Image] --> B[Check Loading State]
    B --> C[Create New Texture]
    C --> D[Create New Material]
    D --> E[Create New Mesh]
    E --> F[Old Mesh Removed]
    F --> G[Old Geometry Disposed]
    G --> H[Old Material Disposed]
    H --> I[Old Texture Disposed]
    I --> J[Clean Object URL]
    J --> K[No Memory Leak]
    
    style I fill:#51cf66
    style K fill:#51cf66
```

## Code Changes Overview

### 1. Add State Management
```javascript
// Add at the top after variable declarations
let isLoading = false;
```

### 2. Improve createCup Function
```javascript
function createCup(texturePath) {
    // Prevent concurrent loads
    if (isLoading) {
        console.log('Already loading a texture, please wait...');
        return;
    }
    
    isLoading = true;
    loadingIndicator.style.display = 'flex';
    
    textureLoader.load(
        texturePath,
        (texture) => {
            // ... existing texture setup ...
            
            // IMPROVED: Dispose of old resources including textures
            if (cupMesh) {
                scene.remove(cupMesh);
                cupMesh.geometry.dispose();
                if (Array.isArray(cupMesh.material)) {
                    cupMesh.material.forEach(mat => {
                        if (mat.map) mat.map.dispose(); // NEW
                        mat.dispose();
                    });
                } else {
                    if (cupMesh.material.map) cupMesh.material.map.dispose(); // NEW
                    cupMesh.material.dispose();
                }
            }
            
            // ... rest of cup creation ...
            
            isLoading = false;
            loadingIndicator.style.display = 'none';
            
            // Clean up blob URL if applicable
            if (texturePath.startsWith('blob:')) {
                URL.revokeObjectURL(texturePath);
            }
        },
        undefined,
        (error) => {
            console.error('Error loading texture:', error);
            isLoading = false;
            loadingIndicator.style.display = 'none';
            
            // Clean up blob URL on error too
            if (texturePath.startsWith('blob:')) {
                URL.revokeObjectURL(texturePath);
            }
            
            // IMPROVED: Better error message
            let errorMessage = 'Error loading texture. ';
            if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please check the file format and try again.';
            }
            alert(errorMessage);
        }
    );
}
```

### 3. Improve Upload Handler
```javascript
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // ... existing validation ...
    
    fileName.textContent = file.name;
    
    const imageUrl = URL.createObjectURL(file);
    createCup(imageUrl);
    
    // IMPROVED: Reset input to allow re-uploading same file
    event.target.value = '';
    
    // REMOVED: setTimeout cleanup (now handled in createCup)
});
```

### 4. Remove All Duplicate Code
Delete lines 203-874 entirely. The file should end at line 202.

## Testing Strategy

### Unit Tests
1. **Memory Management**
   - Upload 10 images sequentially
   - Check memory usage in DevTools
   - Verify no texture objects remain in memory

2. **Loading State**
   - Attempt rapid successive uploads
   - Verify only one loads at a time
   - Check loading indicator behavior

3. **Error Handling**
   - Upload invalid file types
   - Upload corrupted images
   - Verify appropriate error messages

### Integration Tests
1. **Full User Flow**
   - Load page → See default QR texture
   - Upload custom image → See it on cup
   - Rotate and zoom → Verify smooth controls
   - Upload another image → Verify replacement works

2. **Edge Cases**
   - Upload same file twice
   - Upload during active load
   - Resize window during load
   - Upload maximum size file (10MB)

### Performance Tests
1. **Memory Profiling**
   - Baseline memory usage
   - Memory after 20 uploads
   - Verify no memory growth

2. **Rendering Performance**
   - FPS monitoring
   - Verify 60fps on standard hardware
   - Check performance with large textures

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking existing functionality | Low | Code changes are additive/cleanup only |
| Performance regression | Very Low | Improvements only enhance performance |
| User experience disruption | Very Low | Changes improve UX |
| Memory issues persist | Low | Comprehensive disposal added |
| New bugs introduced | Low | Thorough testing plan in place |

## Implementation Phases

### Phase 1: Critical Fix (IMMEDIATE)
- Remove duplicate code from main.js
- Verify application still works
- Deploy to prevent confusion

### Phase 2: Memory Management (HIGH PRIORITY)
- Add texture disposal
- Fix object URL cleanup
- Add loading state management
- Test memory usage

### Phase 3: UX Improvements (MEDIUM PRIORITY)
- Improve error messages
- Add file input reset
- Remove debug statements
- Test user flows

### Phase 4: Validation (FINAL)
- Run full test suite
- Performance profiling
- Cross-browser testing
- Mobile device testing

## Success Criteria

✅ File size reduced from 874 to ~240 lines  
✅ No code duplication  
✅ Memory usage stable after multiple uploads  
✅ Single animation loop running  
✅ Proper resource cleanup  
✅ Better error messages  
✅ All tests passing  
✅ 60fps rendering maintained  

## Next Steps

1. Review this architecture plan
2. Confirm approach with stakeholders
3. Switch to Code mode to implement fixes
4. Run test suite
5. Deploy fixed version
