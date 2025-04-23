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
  createTheme,
  ThemeProvider,
} from "@mui/material";

// Define custom theme
const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#bdbdbd",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#bdbdbd",
          "&.Mui-checked": {
            color: "#1976d2",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 500,
          borderRadius: "4px",
          padding: "6px 16px",
        },
      },
    },
  },
});

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
        additionalComments: false,
      }));
    } else {
      setEnabledFields((prev) => ({
        ...prev,
        circumstances: false,
        daysInUK: true,
        specialCircumstanceDays: false,
        visitsToUK: false,
        additionalComments: false,
      }));
    }
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const residenceCircumstances = form.watch("residenceCircumstances");

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          maxWidth: 1200,
          width: "95%",
          mx: "auto",
          mt: 4,
          px: { xs: 2, sm: 3 }, // Add padding for mobile
        }}
      >
        <CardHeader
          title="Residency Status"
          sx={{
            borderBottom: "1px solid #e0e0e0",
            pb: 2,
            "& .MuiTypography-root": {
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              fontWeight: 500,
            },
          }}
        />
        <CardContent sx={{ pt: 3 }}>
          <Box
            component="form"
            onSubmit={form.handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* First Row with Principal Country and Residence Circumstances */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 3, sm: 4 }}
            >
              {/* Principal Country */}
              <FormControl sx={{ flex: 1 }}>
                <InputLabel sx={{ backgroundColor: "white", px: 1 }}>
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
                <FormHelperText sx={{ color: "#757575" }}>
                  For Split Year claims, please enter the non-UK country
                </FormHelperText>
              </FormControl>

              {/* Residence Circumstances */}
              <FormControl sx={{ flex: 1 }}>
                <InputLabel sx={{ backgroundColor: "white", px: 1 }}>
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
            </Stack>

            {/* Tax Year Circumstances */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: "#424242",
                  fontWeight: 500,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                }}
              >
                Please select all relevant Tax Year circumstances
              </Typography>
              <Stack spacing={2}>
                {/* First Row of Checkboxes */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 4 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!enabledFields.circumstances}
                        checked={form.watch("hadHomeInCountry")}
                        onChange={(e) => {
                          form.setValue("hadHomeInCountry", e.target.checked);
                          if (residenceCircumstances === "non_uk_resident") {
                            enableNextField("hadHomeInCountry", "daysInUK");
                          }
                        }}
                      />
                    }
                    label="I had a home in the country of residence"
                    sx={{
                      flex: { sm: 1 },
                      ml: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
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
                    sx={{
                      flex: { sm: 1 },
                      ml: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
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
                    sx={{
                      flex: { sm: 1 },
                      ml: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
                  />
                </Stack>

                {/* Second Row of Checkboxes */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 4 }}
                >
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
                    sx={{
                      flex: { sm: 1 },
                      ml: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
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
                    sx={{
                      flex: { sm: 1 },
                      ml: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
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
                    sx={{
                      flex: { sm: 1 },
                      ml: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Box>

            {/* Days in UK Section */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 4 }}
            >
              <TextField
                fullWidth
                label="Number of days spent in the UK during the tax year"
                disabled={!enabledFields.daysInUK}
                {...form.register("daysInUK")}
                onChange={(e) => {
                  form.setValue("daysInUK", e.target.value);
                  enableNextField("daysInUK", "specialCircumstanceDays");
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  },
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  },
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  },
                }}
              />
            </Stack>

            {/* Additional Comments */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Any additional comments about residency status"
              disabled={!enabledFields.additionalComments}
              {...form.register("additionalComments")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
              }}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 2 }}
              justifyContent="flex-end"
              sx={{ mt: 3 }}
            >
              <Button
                fullWidth={false}
                variant="text"
                sx={{
                  color: "#757575",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                BACK
              </Button>
              <Button
                fullWidth={false}
                variant="contained"
                sx={{
                  backgroundColor: "#1a237e",
                  "&:hover": {
                    backgroundColor: "#0d47a1",
                  },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                SAVE FOR LATER
              </Button>
              <Button
                fullWidth={false}
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#2e7d32",
                  "&:hover": {
                    backgroundColor: "#1b5e20",
                  },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                CONTINUE
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
