import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number | string; // Allow both number and string IDs
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badges?: string[];
  handle?: string;
  variants?: Array<{ id: string; availableForSale?: boolean; }>;
  onAddToCart: (product: any) => void;
  onToggleWishlist: (productId: number | string) => void;
  isWishlisted: boolean;
}

const ProductCard = ({
  id,
  name,
  category,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  badges = [],
  handle,
  variants,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) => {
  const navigate = useNavigate();
  const product = { id, name, category, price, image, handle, variants };

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-700 ease-out h-full rounded-xl sm:rounded-2xl hover:-translate-y-1 hover:scale-[1.01]">
      <div className="relative aspect-square overflow-hidden">
        {/* Product Image */}
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          loading="lazy"
          onError={(e) => {
            if ((e.currentTarget as HTMLImageElement).src.endsWith("placeholder.svg")) return;
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-pointer"
          onClick={handleProductClick}
        />
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="bg-white/80 backdrop-blur text-foreground text-[10px] tracking-wide px-2 py-0.5 rounded uppercase border border-black/10 transition-all duration-500 ease-out group-hover:bg-white group-hover:scale-105 group-hover:shadow-md"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Rating overlay removed */}

        {/* Wishlist heart overlay */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-foreground shadow-sm transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg"
          onClick={() => onToggleWishlist(id)}
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 transition-all duration-500 ease-out ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </Button>

        {/* Add to cart button - always visible like the reference */}
        <div className="absolute inset-x-3 bottom-3">
          <Button
            variant="outline"
            className="w-full rounded-full border border-black/20 bg-white/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md hover:bg-white text-foreground hover:text-foreground transition-all duration-500 ease-out shadow-sm hover:shadow-md hover:scale-105"
            onClick={() => onAddToCart(product)}
          >
            ADD TO CART
          </Button>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        {/* Title */}
        <div className="mb-1">
          <h3 
            className="font-medium text-foreground group-hover:text-primary transition-colors duration-500 ease-out text-sm sm:text-base cursor-pointer"
            onClick={handleProductClick}
          >
            {name}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mb-2 uppercase transition-colors duration-500 ease-out group-hover:text-foreground">
          {category} • 2 SIZES
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground transition-colors duration-500 ease-out group-hover:text-primary text-sm sm:text-base">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through transition-colors duration-500 ease-out group-hover:text-foreground/60">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;