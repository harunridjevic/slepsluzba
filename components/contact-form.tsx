"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import emailjs from 'emailjs-com'; // Import EmailJS

// Define the shape of the form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export default function KontaktForma() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  
  // Add state for button text
  const [buttonStatus, setButtonStatus] = useState("Pošaljite poruku");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, serviceType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set the button status to "Sending..."
    setButtonStatus("Slanje...");

    // Create a plain object to match the expected type
    const emailData: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        message: formData.message,
    };

    // Send email using EmailJS
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
  
      // Check if all required variables are defined
      if (!serviceId || !templateId || !userId) {
          throw new Error('Missing EmailJS configuration');
      }
  
      await emailjs.send(
          serviceId,
          templateId,
          {
              from_name: formData.name,
              from_email: formData.email,
              from_phone: formData.phone,
              service_type: formData.serviceType,
              message: formData.message,
          },
          userId
      );
  
      setButtonStatus("Poruka je uspešno poslata!");

      // Clear the form data
      setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          message: "",
      });

      // Reset button text after 3 seconds
      setTimeout(() => {
        setButtonStatus("Pošaljite poruku");
      }, 3000);
  
    } catch (error) {
      console.error('Error sending email:', error);
      setButtonStatus("Došlo je do greške");

      // Reset button text after 3 seconds
      setTimeout(() => {
        setButtonStatus("Pošaljite poruku");
      }, 3000);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-blue-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800 dark:text-white">Kontaktirajte nas</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Ime
              </label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefon
            </label>
            <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          </div>
          <div>
            <label htmlFor="serviceType" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Vrsta usluge
            </label>
            <Select onValueChange={handleSelectChange} name="serviceType">
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600">
                <SelectValue placeholder="Izaberite uslugu" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                <SelectItem value="vuca">Vuča</SelectItem>
                <SelectItem value="pomoc-na-cesti">Pomoć na cesti</SelectItem>
                <SelectItem value="izvlacenje-vozila">Izvlačenje vozila</SelectItem>
                <SelectItem value="other">Ostalo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Poruka
            </label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          </div>
          <Button type="submit" className="w-full dark:bg-blue-700 dark:hover:bg-blue-600">
            {buttonStatus}
          </Button>
        </form>
      </div>
    </section>
  );
}
