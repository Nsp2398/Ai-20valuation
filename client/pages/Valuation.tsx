import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  DollarSign, 
  Users, 
  Target,
  Brain,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  {
    id: 1,
    title: "Company Overview",
    description: "Basic information about your business",
    icon: Building2
  },
  {
    id: 2,
    title: "Financial Data",
    description: "Revenue, expenses, and financial metrics",
    icon: DollarSign
  },
  {
    id: 3,
    title: "Team & Market",
    description: "Team size, market opportunity, and competition",
    icon: Users
  },
  {
    id: 4,
    title: "Goals & Strategy",
    description: "Business goals and growth strategy",
    icon: Target
  },
  {
    id: 5,
    title: "AI Analysis",
    description: "Our AI analyzes your data and recommends methods",
    icon: Brain
  },
  {
    id: 6,
    title: "Valuation Report",
    description: "Download your professional valuation report",
    icon: FileText
  }
];

export default function Valuation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    stage: "",
    description: "",
    revenue: "",
    expenses: "",
    teamSize: "",
    marketSize: "",
    fundingGoal: ""
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                placeholder="Enter your company name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select onValueChange={(value) => updateFormData("industry", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="biotech">Biotech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Business Stage *</Label>
              <RadioGroup 
                value={formData.stage} 
                onValueChange={(value) => updateFormData("stage", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="idea" id="idea" />
                  <Label htmlFor="idea">Idea Stage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pre-revenue" id="pre-revenue" />
                  <Label htmlFor="pre-revenue">Pre-Revenue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="early-revenue" id="early-revenue" />
                  <Label htmlFor="early-revenue">Early Revenue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="growth" id="growth" />
                  <Label htmlFor="growth">Growth Stage</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe your business, products/services, and value proposition"
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="revenue">Annual Revenue (USD)</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue}
                onChange={(e) => updateFormData("revenue", e.target.value)}
                placeholder="Enter annual revenue or 0 if pre-revenue"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="expenses">Annual Expenses (USD)</Label>
              <Input
                id="expenses"
                type="number"
                value={formData.expenses}
                onChange={(e) => updateFormData("expenses", e.target.value)}
                placeholder="Enter annual operating expenses"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Monthly Burn Rate</Label>
                <Input
                  type="number"
                  placeholder="Monthly cash burn"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Runway (Months)</Label>
                <Input
                  type="number"
                  placeholder="Months of runway left"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Previous Funding</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Previous funding rounds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No previous funding</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="teamSize">Team Size *</Label>
              <Input
                id="teamSize"
                type="number"
                value={formData.teamSize}
                onChange={(e) => updateFormData("teamSize", e.target.value)}
                placeholder="Number of team members"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="marketSize">Total Addressable Market (TAM) *</Label>
              <Input
                id="marketSize"
                value={formData.marketSize}
                onChange={(e) => updateFormData("marketSize", e.target.value)}
                placeholder="e.g., $1B, $500M"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Geographic Market</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select primary market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia-Pacific</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Competitive Landscape</Label>
              <Textarea
                placeholder="Describe your main competitors and competitive advantages"
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fundingGoal">Funding Goal (USD) *</Label>
              <Input
                id="fundingGoal"
                value={formData.fundingGoal}
                onChange={(e) => updateFormData("fundingGoal", e.target.value)}
                placeholder="Amount you're looking to raise"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Use of Funds</Label>
              <Textarea
                placeholder="How will you use the funding? (e.g., product development, marketing, hiring)"
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label>5-Year Revenue Projection</Label>
              <Input
                type="number"
                placeholder="Projected revenue in 5 years"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Business Model</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription/SaaS</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="transaction">Transaction-based</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">AI Analysis in Progress</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI is analyzing your business data and determining the most suitable valuation methods based on your company stage, industry, and financial metrics.
            </p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm">Business stage analysis complete</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm">Market data integration complete</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm">Valuation methods selected</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold mb-3">Recommended Methods:</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Scorecard Method</Badge>
                <Badge variant="outline" className="mr-2">Risk Factor Summation</Badge>
                <Badge variant="outline">Market Comparables</Badge>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold">Valuation Complete!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your professional valuation report is ready. Download it now to share with investors, advisors, or for your records.
            </p>

            <Card className="max-w-md mx-auto text-left">
              <CardHeader>
                <CardTitle className="text-lg">Valuation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Estimated Valuation:</span>
                  <span className="font-bold text-primary">$2.5M - $3.2M</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Method:</span>
                  <span>Scorecard</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Score:</span>
                  <span>85%</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button size="lg" className="w-full max-w-md">
                <FileText className="mr-2 h-5 w-5" />
                Download PDF Report
              </Button>
              <Button variant="outline" size="lg" className="w-full max-w-md">
                Download Word Document
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <Progress value={progress} className="mb-6" />
          
          <div className="flex items-center space-x-4">
            {React.createElement(steps[currentStep - 1].icon, { 
              className: "h-8 w-8 text-primary" 
            })}
            <div>
              <h1 className="text-2xl font-bold">{steps[currentStep - 1].title}</h1>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link to="/dashboard">
              <Button>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
