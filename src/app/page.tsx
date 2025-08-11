"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateHeight, type GenerateHeightOutput } from "@/ai/flows/generate-height";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Ruler, HeartPulse, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
});

export default function Home() {
  const [result, setResult] = useState<GenerateHeightOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSubmittedName(values.name);

    try {
      // Fake delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 500));
      const aiResult = await generateHeight({ name: values.name });
      setResult(aiResult);
    } catch (err) {
      setError("Failed to generate height. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          HeightWise
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          Unveil the stats behind the name. AI-powered height and BMI predictions at your fingertips.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md space-y-6 mt-8 z-10"
      >
        <Card className="shadow-2xl shadow-primary/10 border-border/20 bg-card/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              Generator
            </CardTitle>
            <CardDescription>Enter a name and let our AI do the heavy lifting.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} className="text-base py-6"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full group text-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      Generate
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <div className="w-full max-w-md mt-6 z-10">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-destructive"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-center">Results for <span className="font-bold text-primary">{submittedName}</span></h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResultCard
                  icon={Ruler}
                  label="Height"
                  value={result.height}
                  isObese={result.bmi === 'Too Obese'}
                />
                <ResultCard
                  icon={HeartPulse}
                  label="BMI"
                  value={result.bmi}
                  isObese={result.bmi === 'Too Obese'}
                  subtext={result.bmi !== 'Too Obese' ? 'Healthy Range' : 'Caution'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

interface ResultCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isObese: boolean;
  subtext?: string;
}

const ResultCard = ({ icon: Icon, label, value, isObese, subtext }: ResultCardProps) => (
  <Card className={`text-center pt-6 shadow-lg transition-all ${isObese ? 'border-destructive bg-destructive/10' : 'bg-card/80'}`}>
     <CardHeader className="p-0 justify-center flex">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Icon className={`h-12 w-12 mx-auto ${isObese ? 'text-destructive' : 'text-primary'}`} />
      </motion.div>
    </CardHeader>
    <CardContent className="pt-4">
      <CardDescription>{label}</CardDescription>
      <p className={`text-5xl font-bold tracking-tighter ${isObese ? 'text-destructive' : ''}`}>{value}</p>
      {subtext && <p className={`text-muted-foreground text-sm ${isObese ? 'text-destructive/80' : ''}`}>{subtext}</p>}
    </CardContent>
  </Card>
)
