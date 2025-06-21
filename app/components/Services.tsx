import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Shield, Truck, Clock, Award, Users } from "lucide-react"

const services = [
  {
    icon: Wrench,
    title: "Expert Installation",
    description: "Professional installation services by certified technicians",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "All products come with comprehensive warranty coverage",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day shipping for orders placed before 2 PM",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs",
  },
  {
    icon: Award,
    title: "Certified Parts",
    description: "ISO certified and OEM approved automotive parts",
  },
  {
    icon: Users,
    title: "Expert Advice",
    description: "Technical consultation from automotive specialists",
  },
]

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Genesil?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive automotive solutions with unmatched quality and service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
