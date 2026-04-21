package edu.demo.e3.repository;

import java.util.LinkedList;

import org.springframework.stereotype.Repository;

import edu.demo.e3.entity.Product;

@Repository
public class ProductRepository {
	Product mouse;
	Product Laptop;
	LinkedList<Product> pList=new LinkedList<>();
	
	
	// Insert many products initially
	public String insert() {
		pList.clear();
		pList.add(new Product(101, "Mouse"));
		pList.add(new Product(102, "Laptop"));	
		pList.add(new Product(103, "Monitor"));
		return "Initial products are added";
	}

	public LinkedList<Product> getProducts() {
		return pList;
	}

	public Product findProductById(int id) {
		return pList.stream().filter(p -> p.getId() == id).findFirst().orElse(null);
	}

	public String addProduct(Product product) {
		pList.add(product);
		return "Product " + product.getName() + " added successfully";
	}

	public boolean deleteProductById(int id) {
		return pList.removeIf(p -> p.getId() == id);
	}

	public Product updateProduct(int id, Product productDetails) {
		Product p = findProductById(id);
		if (p != null) {
			p.setName(productDetails.getName());
			return p;
		}
		return null;
	}
	
	

}
