package edu.demo.e3.controller;

import java.util.LinkedList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.demo.e3.entity.Product;
import edu.demo.e3.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {
	
	@Autowired
	private ProductRepository productRepository;
	
	// Task 6.1 & 6.4: GET - Retrieve all products
	@GetMapping
	public ResponseEntity<LinkedList<Product>> getAllProducts() {
		return ResponseEntity.ok(productRepository.getProducts());
	}
	
	// Task 6.2 & 6.4: GET - Specific product by ID
	@GetMapping("/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable("id") int id) {
		Product p = productRepository.findProductById(id);
		if (p != null) {
			return ResponseEntity.ok(p);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	// Task 6.1 & 6.4: POST - Add new product
	@PostMapping
	public ResponseEntity<String> addProduct(@RequestBody Product product) {
		String msg = productRepository.addProduct(product);
		return ResponseEntity.status(HttpStatus.CREATED).body(msg);
	}
	
	// Task 6.3 & 6.4: DELETE - Remove product
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable("id") int id){
		boolean deleted = productRepository.deleteProductById(id);
		if (deleted) {
			return ResponseEntity.ok("Product deleted successfully");
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
	}
	
	// Task 6.3 & 6.4: PUT - Update product
	@PutMapping("/{id}")
	public ResponseEntity<Product> modifyProduct(@PathVariable("id") int id, @RequestBody Product productDetails) {
		Product updated = productRepository.updateProduct(id, productDetails);
		if (updated != null) {
			return ResponseEntity.ok(updated);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	// Helper to initialize products
	@GetMapping("/init")
	public ResponseEntity<String> initProducts() {
		return ResponseEntity.ok(productRepository.insert());
	}
}
