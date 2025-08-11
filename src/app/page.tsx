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
import { Loader2, Ruler, HeartPulse, Sparkles } from "lucide-react";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 overflow-hidden">
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            HeightWise
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter a name to generate a realistic height and BMI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Height & BMI Generator
              </CardTitle>
              <CardDescription>Enter a name and let our AI do the rest.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-destructive"
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
              <h2 className="text-2xl font-semibold text-center">Results for <span className="text-primary">{submittedName}</span></h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="text-center pt-6">
                  <CardHeader className="p-0">
                    <Ruler className="h-10 w-10 mx-auto text-accent" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription>Height</CardDescription>
                    <p className="text-4xl font-bold">{result.height}</p>
                  </CardContent>
                </Card>
                <Card className={`text-center pt-6 ${result.bmi === "Too Obese" ? 'border-destructive bg-destructive/10' : ''}`}>
                   <CardHeader className="p-0">
                    <HeartPulse className="h-10 w-10 mx-auto text-accent" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription>BMI</CardDescription>
                    <p className={`text-4xl font-bold ${result.bmi === "Too Obese" ? 'text-destructive' : ''}`}>{result.bmi}</p>
                    {result.bmi !== "Too Obese" && <p className="text-muted-foreground text-sm">Very Good</p>}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
