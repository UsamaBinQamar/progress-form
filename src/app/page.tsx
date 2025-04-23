"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";

// Define the form schema with Zod
const formSchema = z.object({
  principalCountry: z.string().min(1, "Please select a country"),
  residenceCircumstances: z
    .string()
    .min(1, "Please select your residence circumstances"),
  hadHomeInCountry: z.boolean(),
  wasWorkingFullTime: z.boolean(),
  paidTaxOnUKIncome: z.boolean(),
  wasResidentPreviousYear: z.boolean(),
  wasResidentPreviousThreeYears: z.boolean(),
  wasNotResidentPreviousYear: z.boolean(),
  daysInUK: z.string().min(1, "Please enter number of days"),
  specialCircumstanceDays: z.string().min(1, "Please enter number of days"),
  visitsToUK: z.string().min(1, "Please enter number of visits"),
  additionalComments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResidencyForm() {
  const [enabledFields, setEnabledFields] = useState({
    principalCountry: true,
    residenceCircumstances: true,
    circumstances: false,
    daysInUK: false,
    specialCircumstanceDays: false,
    visitsToUK: false,
    additionalComments: false,
  });

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principalCountry: "",
      residenceCircumstances: "",
      hadHomeInCountry: false,
      wasWorkingFullTime: false,
      paidTaxOnUKIncome: false,
      wasResidentPreviousYear: false,
      wasResidentPreviousThreeYears: false,
      wasNotResidentPreviousYear: false,
      daysInUK: "",
      specialCircumstanceDays: "",
      visitsToUK: "",
      additionalComments: "",
    },
  });

  // Enable the next field when a value is selected
  const enableNextField = (currentField: string, nextField: string) => {
    if (form.getValues(currentField as keyof FormValues)) {
      setEnabledFields((prev) => ({ ...prev, [nextField]: true }));
    }
  };

  // Handle residence circumstances change
  const handleResidenceChange = (value: string) => {
    form.setValue("residenceCircumstances", value);
    if (value === "non_uk_resident") {
      setEnabledFields((prev) => ({
        ...prev,
        circumstances: true,
        daysInUK: false,
        specialCircumstanceDays: false,
        visitsToUK: false,
      }));
    } else {
      setEnabledFields((prev) => ({
        ...prev,
        circumstances: false,
        daysInUK: true,
        specialCircumstanceDays: false,
        visitsToUK: false,
      }));
    }
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const residenceCircumstances = form.watch("residenceCircumstances");

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, boxShadow: 3 }}>
      <CardHeader
        title="Residency Status"
        sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}
      />
      <CardContent>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Principal Country */}
          <FormControl fullWidth>
            <InputLabel>
              Principal Country of Residence in the applicable Tax Year
            </InputLabel>
            <Select
              value={form.watch("principalCountry")}
              onChange={(e) => {
                form.setValue("principalCountry", e.target.value);
              }}
              label="Principal Country of Residence in the applicable Tax Year"
            >
              <MenuItem value="uk">United Kingdom</MenuItem>
              <MenuItem value="us">United States</MenuItem>
              <MenuItem value="fr">France</MenuItem>
              <MenuItem value="de">Germany</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <FormHelperText>
              For Split Year claims, please enter the non-UK country
            </FormHelperText>
          </FormControl>

          {/* Residence Circumstances */}
          <FormControl fullWidth>
            <InputLabel>
              Your residence circumstances for the applicable Tax Year
            </InputLabel>
            <Select
              value={form.watch("residenceCircumstances")}
              onChange={(e) => handleResidenceChange(e.target.value)}
              label="Your residence circumstances for the applicable Tax Year"
            >
              <MenuItem value="uk_resident">UK Resident</MenuItem>
              <MenuItem value="non_uk_resident">Non-UK Resident</MenuItem>
              <MenuItem value="split_year">Split Year Treatment</MenuItem>
            </Select>
          </FormControl>

          {/* Tax Year Circumstances - Only show for Non-UK Resident */}
          {residenceCircumstances === "non_uk_resident" && (
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: enabledFields.circumstances ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Please select all relevant Tax Year circumstances
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!enabledFields.circumstances}
                      checked={form.watch("hadHomeInCountry")}
                      onChange={(e) => {
                        form.setValue("hadHomeInCountry", e.target.checked);
                        enableNextField("circumstances", "daysInUK");
                      }}
                    />
                  }
                  label="I had a home in the country of residence"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!enabledFields.circumstances}
                      checked={form.watch("wasWorkingFullTime")}
                      onChange={(e) =>
                        form.setValue("wasWorkingFullTime", e.target.checked)
                      }
                    />
                  }
                  label="I was working full time in the country of residence"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!enabledFields.circumstances}
                      checked={form.watch("paidTaxOnUKIncome")}
                      onChange={(e) =>
                        form.setValue("paidTaxOnUKIncome", e.target.checked)
                      }
                    />
                  }
                  label="I paid tax on my UK income in the country of residence"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!enabledFields.circumstances}
                      checked={form.watch("wasResidentPreviousYear")}
                      onChange={(e) =>
                        form.setValue(
                          "wasResidentPreviousYear",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="I was resident in the UK in the previous Tax year"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!enabledFields.circumstances}
                      checked={form.watch("wasResidentPreviousThreeYears")}
                      onChange={(e) =>
                        form.setValue(
                          "wasResidentPreviousThreeYears",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="I was resident in the UK in the previous three tax years"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!enabledFields.circumstances}
                      checked={form.watch("wasNotResidentPreviousYear")}
                      onChange={(e) =>
                        form.setValue(
                          "wasNotResidentPreviousYear",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="I was not Resident in the UK in the previous Tax Year"
                />
              </FormGroup>
            </motion.div>
          )}

          {/* Days in UK - Show when enabled and not Non-UK Resident */}
          {(residenceCircumstances === "uk_resident" ||
            residenceCircumstances === "split_year" ||
            enabledFields.daysInUK) && (
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: enabledFields.daysInUK ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Number of days spent in the UK during the tax year"
                  disabled={!enabledFields.daysInUK}
                  {...form.register("daysInUK")}
                  onChange={(e) => {
                    form.setValue("daysInUK", e.target.value);
                    enableNextField("daysInUK", "specialCircumstanceDays");
                  }}
                />
                <TextField
                  fullWidth
                  label="Number of UK days attributable to special circumstances"
                  disabled={!enabledFields.specialCircumstanceDays}
                  {...form.register("specialCircumstanceDays")}
                  onChange={(e) => {
                    form.setValue("specialCircumstanceDays", e.target.value);
                    enableNextField("specialCircumstanceDays", "visitsToUK");
                  }}
                />
                <TextField
                  fullWidth
                  label="Number of visits to the UK in the tax year"
                  disabled={!enabledFields.visitsToUK}
                  {...form.register("visitsToUK")}
                  onChange={(e) => {
                    form.setValue("visitsToUK", e.target.value);
                    enableNextField("visitsToUK", "additionalComments");
                  }}
                />
              </Stack>
            </motion.div>
          )}

          {/* Additional Comments */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: enabledFields.additionalComments ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Any additional comments about residency status"
              disabled={!enabledFields.additionalComments}
              {...form.register("additionalComments")}
            />
          </motion.div>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Button variant="outlined" color="primary">
              BACK
            </Button>
            <Button variant="outlined" color="primary">
              SAVE FOR LATER
            </Button>
            <Button type="submit" variant="contained" color="primary">
              CONTINUE
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
