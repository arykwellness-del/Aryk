import { useState } from "react";
import contactBg from "../../aryk img/pexels-vinta-supply-co-nyc-268013-842948.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ContactUs = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    getCartCount 
  } = useCart();

  const [formLoaded, setFormLoaded] = useState(false);

  return (
    <>
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => {}}
        cartCount={getCartCount()}
        variant="solid"
      />
      
      <div className="min-h-screen bg-background pt-0">
        {/* Hero Section with background image */}
        <div
          className="relative border-b"
          style={{
            backgroundImage: `url(${contactBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 md:mb-6">
                Get in Touch
              </h1>
              <p className="text-base md:text-lg/relaxed opacity-90 mb-6">
                We'd love to hear from you. Questions, feedback or partnerships — say hello!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  aria-label="Email us"
                  onClick={() => { window.location.href = 'mailto:Arykwellness@gmail.com'; }}
                  className="bg-[#f1f0ec] text-[#603d1f] rounded-full px-6 h-11 shadow-sm hover:bg-[#f1f0ec] hover:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#603d1f]/30 focus-visible:ring-offset-2"
                >
                  <Mail className="h-4 w-4 mr-2" /> Email Us
                </Button>
                <Button
                  aria-label="Call now"
                  onClick={() => { window.location.href = 'tel:+919712033661'; }}
                  className="bg-[#f1f0ec] text-[#603d1f] rounded-full px-6 h-11 shadow-sm hover:bg-[#f1f0ec] hover:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#603d1f]/30 focus-visible:ring-offset-2"
                >
                  <Phone className="h-4 w-4 mr-2" /> Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-5 md:p-6 bg-background/80 backdrop-blur rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <Mail className="h-8 w-8 md:h-12 md:w-12 text-blue-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-medium text-foreground mb-2 md:mb-3">Email Us</h3>
                <p className="text-muted-foreground mb-2">
                  Arykwellness@gmail.com
                </p>
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <button
                    className="underline hover:text-foreground"
                    onClick={() => navigator.clipboard?.writeText('Arykwellness@gmail.com')}
                  >
                    Copy email
                  </button>
                  <span>•</span>
                  <span>We'll respond within 24 hours</span>
                </div>
              </div>
              
              <div className="text-center p-5 md:p-6 bg-background/80 backdrop-blur rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <Phone className="h-8 w-8 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-medium text-foreground mb-2 md:mb-3">Call Us</h3>
                <p className="text-muted-foreground mb-2">
                  +91 97120 33661
                </p>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Mon-Sat, 9 AM - 6 PM IST
                </p>
              </div>
              
              <div className="text-center p-5 md:p-6 bg-background/80 backdrop-blur rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <MapPin className="h-8 w-8 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-medium text-foreground mb-2 md:mb-3">Visit Us</h3>
                <p className="text-muted-foreground mb-2 text-sm">
                  SF3-JBR ARCADE<br />
                  SCIENCE CITY AHMEDABAD<br />
                  GUJARAT 380060
                </p>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Mon-Sat, 9 AM - 6 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Contact Form */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm self-start">
                <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground">
                  Send us a Message
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2 mb-4 md:mb-6">
                  We typically reply within 24 hours.
                </p>
                <div className="relative w-full">
                  {/* Skeleton while the embedded form loads */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${formLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="w-full h-[600px] md:h-[800px] rounded-lg bg-muted/40 animate-pulse" />
                  </div>
                  <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSd-YetbJif8X8C0QWgk-jRtrmdG__9Q969Q9ocmGbQtIigAPw/viewform?usp=header"
                    width="100%"
                    height={800}
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="rounded-lg"
                    title="ARYK Organics Contact Form"
                    onLoad={() => setFormLoaded(true)}
                  >
                    Loading…
                  </iframe>
                </div>
                {/* Removed Follow Us and Quick Help sections as requested */}
              </div>

              {/* Contact Details */}
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-4 md:mb-6">
                    Visit Our Office
                  </h2>
              <div className="bg-white p-5 md:p-6 rounded-xl border">
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-foreground">Head Office</h3>
                        <p className="text-muted-foreground">
                          SF3-JBR ARCADE<br />
                          SCIENCE CITY AHMEDABAD<br />
                          GUJARAT 380060
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 mb-4">
                      <Clock className="h-6 w-6 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-foreground">Business Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: 10:00 AM - 2:00PM<br />
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-purple-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-foreground">Emergency Contact</h3>
                        <p className="text-muted-foreground">
                          For urgent matters: +91 97120 33661<br />
                          Available 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social/Quick Help moved under the form */}
                {/* Map preview */}
                 <div id="map-section" className="mt-4 rounded-xl overflow-hidden border self-start">
                  <iframe
                    title="Office map"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.6!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b5b5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sScience%20City%2C%20Ahmedabad%2C%20Gujarat%20380060!5e0!3m2!1sen!2sin!4v1686400000000"
                    className="w-full h-80 md:h-96"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="py-12 md:py-16 bg-gradient-to-r from-[#603d1f] to-[#734c25] text-[#f1f0ec]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-light mb-4 md:mb-6">
              Still Have Questions?
            </h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90 px-2">
              Our customer support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                size="lg"
                aria-label="Call now"
                className="bg-[#f1f0ec] text-[#603d1f] px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-full shadow-sm hover:bg-[#f1f0ec] hover:opacity-90 hover:shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#603d1f]/30 focus-visible:ring-offset-2"
                onClick={() => { window.location.href = 'tel:+919712033661'; }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button
                size="lg"
                aria-label="Open live chat"
                onClick={() => alert('Live chat coming soon!')}
                className="bg-[#f1f0ec] text-[#603d1f] px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-full shadow-sm hover:bg-[#f1f0ec] hover:opacity-90 hover:shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#603d1f]/30 focus-visible:ring-offset-2"
              >
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          // Check if user is signed in
          const savedUser = localStorage.getItem('aryk_user');
          if (!savedUser) {
            // Redirect to sign in
            window.location.href = '/shopify-shop';
            return;
          }
          // Redirect to Shopify shop for checkout
          window.location.href = '/shopify-shop';
        }}
      />
    </>
  );
};

export default ContactUs;
