import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Brain, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Calculator,
  Users,
  Shield,
  Zap
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium">
            AI-Powered Business Intelligence
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Professional Business
            <span className="text-primary block mt-2">Valuation in Minutes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get investor-ready valuation reports using globally accepted methodologies. 
            Our AI guides you through the process and recommends the best valuation methods for your business stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/valuation">
              <Button size="lg" className="text-lg px-8 py-3 h-auto">
                Start Free Valuation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 h-auto">
              View Sample Report
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Generate report in 5-10 minutes
          </p>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-6">Trusted by startups and growth companies worldwide</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="h-8 w-24 bg-muted rounded-md"></div>
            <div className="h-8 w-20 bg-muted rounded-md"></div>
            <div className="h-8 w-28 bg-muted rounded-md"></div>
            <div className="h-8 w-22 bg-muted rounded-md"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose Our AI Valuation Tool?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade valuations made simple with cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">AI-Powered Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI analyzes your business stage and data quality to recommend the most suitable valuation methods with confidence scores.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Calculator className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">Multiple Valuation Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Berkus, Scorecard, Risk Factor, VC Method, DCF, and Comparables - all implemented according to global standards.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">Professional Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Download investor-ready valuation reports in Word and PDF formats with detailed analysis and visualizations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">Market Data Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access real-time competitor benchmarking and market data to strengthen your valuation analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">Step-by-Step Wizard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Intuitive guided process that collects all necessary information without requiring financial modeling expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">Globally Accepted Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All valuation methodologies follow internationally recognized standards trusted by investors and advisors.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Valuation Methods Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-muted/30 rounded-3xl mx-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Comprehensive Valuation Methodologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from industry-standard methods or let our AI recommend the best approach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Berkus Method",
              stage: "Pre-Revenue",
              description: "Ideal for startups with innovative ideas but no revenue"
            },
            {
              name: "Scorecard Method",
              stage: "Early Stage",
              description: "Compares your startup to similar funded companies"
            },
            {
              name: "Risk Factor Summation",
              stage: "Seed/Series A",
              description: "Adjusts valuation based on risk assessment"
            },
            {
              name: "VC Method",
              stage: "Growth Stage",
              description: "Backward calculation from expected exit value"
            },
            {
              name: "DCF Analysis",
              stage: "Revenue Stage",
              description: "Discounted cash flow for established businesses"
            },
            {
              name: "Comparable Analysis",
              stage: "All Stages",
              description: "Market-based valuation using industry multiples"
            }
          ].map((method, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mx-auto mb-2">
                  {method.stage}
                </Badge>
                <CardTitle className="text-lg">{method.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">$2.8B</div>
            <p className="text-muted-foreground">Market Size by 2027</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <p className="text-muted-foreground">Accuracy Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10min</div>
            <p className="text-muted-foreground">Average Completion</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Companies Valued</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <Card className="p-12 bg-primary text-primary-foreground border-0">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Value Your Business?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of entrepreneurs who have received professional valuations 
            and successfully raised funding with our AI-powered tool.
          </p>
          <Link to="/valuation">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 h-auto">
              Start Your Free Valuation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
