"use client";

import { useState } from "react";

type FormStep = "name" | "email" | "topic" | "message" | "completed";

type FormData = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

type SubmissionStatus = "submitting" | "success" | null;

const questions = {
  name: "what's your name?",
  email: "what's your email?",
  topic: "what would you like to talk about?",
  message: "anything else you'd like to add?",
};

const validateInput = (step: FormStep, value: string) => {
  if (!value.trim()) {
    return "field cannot be empty";
  }

  switch (step) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "please enter a valid email address";
      }
      break;
    case "name":
      if (value.length < 2) {
        return "name must be at least 2 characters long";
      }
      break;
    case "topic":
      if (value.length < 10) {
        return "please provide a bit more detail about your topic";
      }
      break;
  }

  return null;
};

export function CliForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>("name");
  const [error, setError] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<FormStep | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [inputValues, setInputValues] = useState<FormData>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>(null);

  const handleSubmit = async (value: string, step = currentStep) => {
    const validationError = validateInput(step, value);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const newFormData = { ...formData };

    switch (step) {
      case "name":
        newFormData.name = value;
        setFormData(newFormData);
        setCurrentStep(editingStep ? currentStep : "email");
        break;
      case "email":
        newFormData.email = value;
        setFormData(newFormData);
        setCurrentStep(editingStep ? currentStep : "topic");
        break;
      case "topic":
        newFormData.topic = value;
        setFormData(newFormData);
        setCurrentStep(editingStep ? currentStep : "message");
        break;
      case "message":
        newFormData.message = value;
        setFormData(newFormData);

        if (!editingStep) {
          try {
            setSubmissionStatus("submitting");
            const response = await fetch("/s", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...newFormData,
                message: value,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              setError(errorText);
              setSubmissionStatus(null);
              return;
            }

            setFormData(newFormData);
            setCurrentStep("completed");
            setSubmissionStatus("success");
          } catch (err) {
            setError("failed to submit. please try again.");
            setSubmissionStatus(null);
            console.error(err);
            return;
          }
        } else {
          setFormData(newFormData);
        }
        break;
    }
    setEditingStep(null);
  };

  const exitEditing = () => {
    setEditingStep(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      exitEditing();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const stepToValidate = editingStep || currentStep;
      const currentValue = inputValues[stepToValidate as keyof FormData];

      if (!currentValue.trim()) {
        setError("field cannot be empty");
        return;
      }

      const validationError = validateInput(
        stepToValidate,
        currentValue.trim()
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      handleSubmit(currentValue.trim(), stepToValidate);
      setInputValues((prev) => ({
        ...prev,
        [stepToValidate]: "",
      }));
    }
  };

  const handleEdit = (step: FormStep) => {
    if (currentStep === "completed") return;

    if (editingStep && step === currentStep) {
      exitEditing();
      return;
    }

    if (editingStep === step) {
      exitEditing();
    } else {
      setEditingStep(step);
      setInputValues((prev) => ({
        ...prev,
        [step]: formData[step as keyof typeof formData],
      }));
      setError(null);
    }
  };

  const renderInput = () => {
    const activeStep = editingStep || currentStep;
    if (editingStep && editingStep !== activeStep) return null;

    const commonProps = {
      value: inputValues[activeStep as keyof FormData],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setInputValues((prev) => ({
          ...prev,
          [activeStep]: e.target.value,
        }));
        setError(null);
      },
      onKeyDown: handleKeyPress,
      className: "bg-transparent focus:outline-none w-full",
    };

    const inputElement = (() => {
      switch (activeStep) {
        case "name":
          return <input type="text" autoComplete="name" {...commonProps} />;
        case "email":
          return <input type="email" autoComplete="email" {...commonProps} />;
        case "topic":
        case "message":
          return (
            <textarea
              rows={1}
              {...commonProps}
              className={`${commonProps.className} resize-none overflow-hidden`}
              style={{
                height: "auto",
                minHeight: "1.2em",
              }}
              ref={(textarea) => {
                if (textarea) {
                  textarea.style.height = "auto";
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }
              }}
            />
          );
      }
    })();

    return (
      <div
        ref={(el) => {
          if (el) {
            const input = el.querySelector("input, textarea") as
              | HTMLInputElement
              | HTMLTextAreaElement
              | null;
            input?.focus();
          }
        }}
        className="flex-1 flex"
      >
        {inputElement}
      </div>
    );
  };

  const renderCompletedStep = (step: FormStep) => {
    const isEditing = editingStep === step;

    if (isEditing) {
      return (
        <div className="space-y-1 text-stone-50">
          <div className="flex items-center justify-between w-full">
            <p>
              {"$ "}
              {questions[step as keyof typeof questions]}
            </p>
            <p className="text-stone-500 text-[10px]">↵ to submit</p>
          </div>
          <div className="flex gap-2">
            <span>&gt;</span>
            {renderInput()}
          </div>
          {error && (
            <div className="flex text-red-500">
              <span>!</span>
              <p className="ml-2">{error}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`space-y-1 text-stone-500 ${
          currentStep !== "completed"
            ? "cursor-pointer hover:text-stone-400"
            : ""
        }`}
        onClick={() => currentStep !== "completed" && handleEdit(step)}
      >
        <p>
          {"$ "}
          {questions[step as keyof typeof questions]}
        </p>
        <div className="flex">
          <span>&gt;</span>
          <p className="ml-2 whitespace-pre-wrap [word-break:break-word]">
            {formData[step as keyof typeof formData]}
          </p>
        </div>
      </div>
    );
  };

  if (currentStep === "completed") {
    return (
      <div className="space-y-2 text-stone-500">
        {renderCompletedStep("name")}
        {renderCompletedStep("email")}
        {renderCompletedStep("topic")}
        {renderCompletedStep("message")}
        <div className="text-green-400">
          {submissionStatus === "submitting" ? (
            <p>submitting...</p>
          ) : submissionStatus === "success" ? (
            <>
              <p>✓ thanks for your submission!</p>
              <p className="text-stone-200 text-xs">
                &nbsp;&nbsp;we&apos;ll get back to you soon.
              </p>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  console.log({ currentStep, editingStep });

  return (
    <div className="space-y-2">
      {/* Show all completed steps, including the one being edited */}
      {formData.name && renderCompletedStep("name")}
      {formData.email && renderCompletedStep("email")}
      {formData.topic && renderCompletedStep("topic")}

      {/* Current question */}
      <div
        className={`space-y-1 ${
          editingStep
            ? "text-stone-500 cursor-pointer hover:text-stone-400"
            : ""
        }`}
        onClick={() => editingStep && handleEdit(currentStep)}
      >
        <div className="flex items-center justify-between w-full">
          <p>
            {"$ "}
            {questions[currentStep as keyof typeof questions]}
          </p>
          {(!editingStep || editingStep === currentStep) && (
            <span className="text-stone-500 text-[10px] ml-2">↵ to submit</span>
          )}
        </div>
        <div className="flex">
          <span>&gt;</span>
          <div className="flex-1 ml-2">
            {(!editingStep || editingStep === currentStep) && renderInput()}
            {editingStep && editingStep !== currentStep && (
              <p className="whitespace-pre-wrap [word-break:break-word]">
                {inputValues[currentStep] ||
                  formData[currentStep as keyof typeof formData]}
              </p>
            )}
          </div>
        </div>
        {!editingStep && error && (
          <div className="flex text-red-500">
            <span>!</span>
            <p className="ml-2">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
