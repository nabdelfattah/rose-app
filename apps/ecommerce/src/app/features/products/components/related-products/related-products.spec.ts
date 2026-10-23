import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RelatedProducts } from "./related-products";
import { Product } from "../../model/product";
import { provideRouter } from "@angular/router";

describe("RelatedProducts", () => {
  let fixture: ComponentFixture<RelatedProducts>;
  let component: RelatedProducts;

  const products = [
    { id: "p1", title: "Product 1" },
    { id: "p2", title: "Product 2" },
  ] as Product[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedProducts],
      providers:[
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedProducts);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should receive and expose the provided products", () => {
    fixture.componentRef.setInput("products", products);
    fixture.detectChanges();
    expect(component.products()).toEqual(products);
  });

  it("should default to an empty products array", () => {
    expect(component.products()).toEqual([]);
  });

  it("should have responsive carousel options", () => {
    expect(component.responsiveOptions.length).toBeGreaterThan(0);
    expect(component.responsiveOptions[0].numVisible).toBe(4);
  });

  //Template

  it("should render the carousel", () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("p-carousel")).toBeTruthy();
  });

  it("should pass products to the carousel", () => {
    fixture.componentRef.setInput("products", products);
    fixture.detectChanges();
    expect(component.products()).toEqual(products);
  });
});
