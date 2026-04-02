from setuptools import setup, find_packages

setup(
    name="great-humans",
    version="1.0.0",
    description="Instant personas ready for LLM prompting - 100 Great Humans dataset",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Great Humans Project",
    packages=find_packages(),
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    keywords="agents, llm, personas, history, ai",
    project_urls={
        "GitHub": "https://github.com/Gzeu/100-great-humans",
    },
)
