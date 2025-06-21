import { Button } from "@/components/ui/button"
import { CheckCircle, Award, Users, Wrench } from "lucide-react"
import Image from "next/image"

const achievements = [
  "15+ years of industry experience",
  "Genuine spare parts only",
  "Toyota, Nissan, Subaru & Mitsubishi specialist",
  "European brands coverage",
  "Located in Kirinyaga Road, Nairobi",
  "Trusted by mechanics & car owners",
]

export default function About() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6 font-heading">About Us</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground">
                  Genesil Autobrake & Accessories Ltd is your trusted spare parts supplier based in{" "}
                  <span className="text-primary font-semibold">Kirinyaga Road, Nairobi</span> — the heart of Kenya's
                  auto scene.
                </p>

                <p>
                  We deal strictly in{" "}
                  <span className="text-primary font-semibold">high-quality, genuine spare parts</span> for a wide range
                  of vehicles — from Toyota, Nissan, Subaru, and Mitsubishi to European brands. Whether you're fixing up
                  a daily driver or running a garage, we've got the parts that keep engines running and customers happy.
                </p>

                <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-foreground mb-3">Our mission is simple:</h3>
                  <p className="text-foreground font-medium">
                    Deliver the right parts, at the right price, with zero compromise.
                  </p>
                </div>

                <div className="space-y-2 text-foreground font-medium">
                  <p>✓ No fakes. No delays. No guesswork.</p>
                  <p>✓ Just real parts that work — the first time.</p>
                  <p>✓ Mechanics trust us. Car owners rely on us.</p>
                  <p>✓ We show up every day to keep Nairobi moving.</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Genesil Autobrake.</h3>
                  <p className="text-lg font-semibold text-foreground">Real parts. Real performance. No excuses.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-card border border-border hover:shadow-md transition-all duration-300"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{achievement}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Learn More About Our Services
            </Button>
          </div>

          <div className="relative">
            {/* Background with logo and fade effect */}
            <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl p-8 overflow-hidden">
              {/* Logo background with fade effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Image
                  src="/images/genesil-logo.png"
                  alt="Genesil Logo Background"
                  width={400}
                  height={300}
                  className="object-contain animate-float"
                />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 text-center border border-border hover:shadow-lg transition-all duration-300">
                    <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h4 className="text-2xl font-bold text-foreground">15+</h4>
                    <p className="text-muted-foreground">Years of Excellence</p>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 text-center border border-border hover:shadow-lg transition-all duration-300">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h4 className="text-2xl font-bold text-foreground">1000+</h4>
                    <p className="text-muted-foreground">Happy Customers</p>
                  </div>
                </div>

                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 text-center border border-border hover:shadow-lg transition-all duration-300">
                  <Wrench className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-foreground">Genuine Parts Only</h4>
                  <p className="text-muted-foreground">Quality guaranteed, performance assured</p>
                </div>

                <div className="bg-primary/20 backdrop-blur-sm rounded-lg p-6 border border-primary/30">
                  <h4 className="text-lg font-bold text-foreground mb-2">Located in the Heart of Nairobi</h4>
                  <p className="text-muted-foreground">Kirinyaga Road - Kenya's premier automotive district</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
